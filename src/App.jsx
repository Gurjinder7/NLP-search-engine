import { useState, useRef, useEffect } from "react";
import "./App.css";
import LanguageSelector from "./components/LanguageSelector";
import Progress from "./components/Progress";
import ModelSelector from "./components/ModelSelector";
import { MODEL } from "./constant";
import { default as axios } from "axios";
import Answers from "./components/Answers";

function App() {
  // const [count, setCount] = useState(0)
  const [ready, setReady] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [progressItems, setProgressItems] = useState([]);

  // Inputs and outputs
  const [input, setInput] = useState("What is the latest news on NASA?");

  const [selectedModel, setSelectedModel] = useState(MODEL.MIXED_BREAD_AI);
  const [searchResult, setSearchResult] = useState([]);
  const [output, setOutput] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [summaryAnswer, setSummaryAnswer] = useState(null);
  const [sentimentAnswers, setSentimentAnswers] = useState([])

  const worker = useRef(null);
  const sentimentWorker = useRef(null);

  useEffect(() => {
    worker.current ??= new Worker(new URL("./worker.js", import.meta.url), {
      type: "module",
    });

    sentimentWorker.current ??= new Worker(
      new URL("./sentimentWorker.js", import.meta.url),
      {
        type: "module",
      }
    );

    const onSummaryMessageReceived = (e) => {
      // console.log(e.data);
      let answer = selectedAnswer;
      switch (e.data.status) {
        case "initiate":
          // Model file start load: add a new progress item to the list.
          setReady(false);
          setProgressItems((prev) => [...prev, e.data]);
          break;

        case "progress":
          // Model file progress: update one of the progress items.
          setProgressItems((prev) =>
            prev.map((item) => {
              if (item.file === e.data.file) {
                return { ...item, progress: e.data.progress };
              }
              return item;
            })
          );
          break;

        case "done":
          // Model file loaded: remove the progress item from the list.
          setProgressItems((prev) =>
            prev.filter((item) => item.file !== e.data.file)
          );
          break;

        case "ready":
          // Pipeline ready: the worker is ready to accept messages.
          setReady(true);
          break;

        case "update":
          // Generation update: update the output text.
          setOutput((o) => o + e.data.output);
          break;

        case "complete":
          // Generation complete: re-enable the "Translate" button
          if (selectedAnswer) {
            console.log(e?.data?.output[0]);
            answer = selectedAnswer;
            answer.summary = e?.data?.output[0].summary_text;
            // setSelectedAnswer(answer)
            setSummaryAnswer(answer);
            setDisabled(false);
          }
          break;
      }
    };

    worker.current.addEventListener("message", onSummaryMessageReceived);
    sentimentWorker.current.addEventListener(
      "message",
      onSentimentMessageReceived
    );

    return () => {
      worker.current.removeEventListener("message", onSummaryMessageReceived);
      sentimentWorker.current.removeEventListener(
        "message",
        onSentimentMessageReceived
      );
    };
  });

  const onSentimentMessageReceived = (e) => {
    console.log(e.data);
    let answer = selectedAnswer;
    switch (e.data.status) {
      case "initiate":
        // Model file start load: add a new progress item to the list.
        setReady(false);
        setProgressItems((prev) => [...prev, e.data]);
        break;

      case "progress":
        // Model file progress: update one of the progress items.
        setProgressItems((prev) =>
          prev.map((item) => {
            if (item.file === e.data.file) {
              return { ...item, progress: e.data.progress };
            }
            return item;
          })
        );
        break;

      case "done":
        // Model file loaded: remove the progress item from the list.
        setProgressItems((prev) =>
          prev.filter((item) => item.file !== e.data.file)
        );
        break;

      case "ready":
        // Pipeline ready: the worker is ready to accept messages.
        setReady(true);
        break;

      case "update":
        // Generation update: update the output text.
        setOutput((o) => o + e.data.output);
        break;

      case "complete":
        // Generation complete: re-enable the "Translate" button
        if (searchResult.length) {
          console.log(e?.data?.output);
          let sentiments = e?.data?.output;
          let sentimentAns = []
           for(let i = 0; i < searchResult.length; i++) {
              searchResult[i].sentiment = sentiments[i]
              sentimentAns.push(searchResult[i])
            }
          
          // answer.summary = e?.data?.output[0].summary_text;
          // setSelectedAnswer(answer)
          // setSearchResult(sentimentAns)
          // setSummaryAnswer(answer);
          setSentimentAnswers(sentimentAns)
          setDisabled(false);
        }
        break;
    }
  };

  useEffect(() => {
    if (worker.current) {
      worker.current.postMessage({
        // text: input,
      });
    }
  }, [worker]);

  useEffect(() => {
    if (sentimentWorker.current) {
      sentimentWorker.current.postMessage({
        // text: input,
      });
    }
  }, [sentimentWorker]);

  useEffect(() => {
    let titles = []
    if(searchResult.length) {
      searchResult.map(item => {
        titles.push(item.payload.title)
      })
    }

    if(titles.length === 5) {
      if (sentimentWorker.current) {
        sentimentWorker.current.postMessage({
          titles: titles
        })
      }
    }
  },[searchResult])

  const getResults = () => {
    console.log(input);
    if (!input) {
      alert("Empty input");
      return;
    }
   resetAll()
    axios
      .post("http://localhost:3000/search", {
        model: "Xenova",
        query: `${input}`,
      })
      .then((response) => {
        console.log(response);
        setSearchResult(response.data.points);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSummary = (data1) => {
    console.log(data1);
    setSelectedAnswer(data1);
    worker.current.postMessage({
      text: data1.payload.description,
    });
  };

  const resetAll = () => {
    setSearchResult([]);
    setSelectedAnswer(null);
    setSummaryAnswer(null);
    setSentimentAnswers([])
  }
  return (
    <>
      <h1 className="text-red-400">Transformers.js</h1>
      <h2>ML-powered semantic search!</h2>

      <div className="">
        <div className="">
          <ModelSelector onChange={(x) => setSelectedModel(x.target.value)} />
        </div>

        <div className="">
          {/* <textarea value={input} rows={3} onChange={e => setInput(e.target.value)}></textarea> */}
          {/* <textarea value={output} rows={3} readOnly></textarea> */}
          <div className="flex flex-col my-4 justify-center">
            {/* <label for="" class="form-label">Name</label> */}
            <input
              type="text"
              className=" mb-3 bg-gray-100 p-3 "
              name=""
              id=""
              aria-describedby="helpId"
              placeholder=""
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onClick={() => resetAll()}
            />
            {/* <small id="helpId" className="">Help text</small> */}
          </div>
        </div>
      </div>

      <button
        disabled={disabled}
        onClick={getResults}
        className="!bg-blue-600 text-white"
      >
        Search
      </button>

      {sentimentAnswers?.length > 0 && (
        <Answers
          answers={sentimentAnswers}
          question={input}
          worker={worker}
          getSummary1={handleSummary}
          summaryAnswer={summaryAnswer}
        />
      )}
    </>
  );
}

export default App;
