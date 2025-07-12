import Highlighter from "react-highlight-words";
import { removeStopwords } from "stopword";
import { useEffect, useState } from "react";
import { getSentiment, haveSummary } from "../worker";
import SentimentScale from "./SentimentScale";

const Answers = ({ answers, question, summary = null, getSummary1 = () => {}, summaryAnswer }) => {
  const [sum1, setSum1] = useState([]);
  const [sum2, setSum2] = useState(null);
  const [answers1, setAnswers1] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [sentiments, setSentiments] = useState(null);

  // useEffect(() => {
  //   console.log(answers1)
  //   setAnswers(answers1)
  // },[answers1])


  useEffect(() => {
    console.log(summaryAnswer)
    let summaryAns = []
    if(summaryAnswer){
      answers?.map((item) => {
        if(item.id === summaryAnswer.id) {
          summaryAns.push(summaryAnswer)
        } else {
          summaryAns.push(item)
        }
      })
      setAnswers1(summaryAns)
      setLoader(false)
    }
  },[summaryAnswer, answers])
  console.log(answers);

  console.log(sum1);

  useEffect(() => {
    let titles = [];
    if (answers.length) {
      // for (const answer of answers) {
      //   titles.push(answer?.payload.title);
      // }

      // // setSentiments(titles)
      // sentimentIs(titles).then((res) => {
      //   console.log(res);
      //   let updatedAnswer = [];
      //   for (let i = 0; i < answers.length; i++) {
      //     answers[i].sentiment = res[i];
      //     updatedAnswer.push(answers[i]);
      //   }

      //   setAnswers1(updatedAnswer);
      // });
      setAnswers1(answers)
    }
  }, []);

  // useEffect(() => {
  //   sentimentIs(sentiments).then(res => {
  //       console.log(res)
  //       let updatedAnswer = []
  //           for(let i = 0; i < answers.length; i++) {
  //             answers[i].sentiment = res[i]
  //             updatedAnswer.push(answers[i])
  //           }

  //       setAnswers(updatedAnswer)
  //   })
  // },[sentiments])

  const getSummary = () => {
    let count = 0;

    const int = setInterval(() => {}, 1000);

    ss1(sum1).then((res) => {
      console.log(res);
      setSum2(res);
    });
  };

  // const ss1 = async (text) => await haveSummary(text);
  // const sentimentIs = async (text) => await getSentiment(text);

  const displayDescription = (answer) => {
    console.log(answer);
    if (answer?.payload.full_description) {
      return answer?.payload.full_description;
    } else if (answer?.payload.content) {
      return answer?.payload.content;
    } else {
      return answer?.payload.description;
    }
  };

  const generateSummary = async (e, answer) => {
    console.log(answer);

    if(answer.summary) {
      return
    }

    getSummary1(answer)
    setLoader(true)
    // setTimeout(() => {

    //   ss1(displayDescription(answer))
    //   .then((res) => {
    //     console.log(res);
    //     let updatedAnswer = [];
    //     answers.map((item) => {
    //       if (item.id == answer.id) {
    //         item.summary = res[0].summary_text;
    //       }
    //       updatedAnswer.push(item);
    //     });
    //     setAnswers1(updatedAnswer);
        
    //     // setAnswers(prev =>
    //       //     prev.map(ans => ans.id === answer.id ? { ...answer, summary: res[0].summary_text} : answer)
    //       // )
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     }).finally(() =>{
    //       setLoader(false)
    //     });
    //   },[1000])
  };

  const getSentimentOfResult = async (title) => {
    // let sentiment = {
    //   label: "",
    //   score: 0,
    // };

    // sentimentIs(title).then((res) => {
    //   console.log(res);
    //   sentiment.label = res[0].label;
    //   sentiment.score = res[0].score;
    // });

    // console.log("sentiment", sentiment);
    // return sentiment;
  };

  console.log(answers);
  const arr = question
    .replace(/[^a-zA-Z0-9]/g, " ")
    .trim()
    .split(" ");
  // console.log(removeStopwords(arr));
  return (
    <div>
     
        {loader && (
          <div className="w-screen h-screen fixed top-1/2 left-1/2 z-10">
            <div className="loader"></div>
          </div>
        )}
        <ul className={`${loader ? 'blur-sm' : ''}`}>
          {answers1?.map((item) => (
            <div key={item.id} className="my-5 p-2">
              <h3 className="text-xl font-semibold">{item.payload.title}</h3>
              <div className="flex justify-between">
                <p className="font-bold text-indigo-600">Similarity score: {item.score}</p>
                <p>Article link: {item?.payload?.link ? <a href={item?.payload?.link} target="_blank" className="underline"> {item?.payload?.source_id}</a> : '-'}</p>
              </div>
              <div>
                {item?.summary && (
                  <p className="font-semibold">Summary: <span className="italic"> {item?.summary}</span></p>
                )}
                {/* <p>Sentiments:{item?.sentiment?.label} </p> */}
                {item?.sentiment && (
                  <SentimentScale sentiment={item?.sentiment} />
                )}
                <div
                  onClick={() => setSelectedAnswer(item)}
                  className={`${
                    selectedAnswer?.id === item.id
                      ? "open-answer"
                      : "close-answer"
                  } max-h-[20vh] overflow-auto p-3 text-justify bg-gray-100`}
                >
                  <Highlighter
                    highlightClassName="YourHighlightClass"
                    searchWords={removeStopwords(arr)}
                    autoEscape={true}
                    textToHighlight={displayDescription(item)}
                  />
                </div>
                <button
                  onClick={(e) => generateSummary(e, item)}
                  className="my-3 !bg-gray-300 "
                >
                  Generate Summary
                </button>
              </div>
              <div></div>
              <hr />
            </div>
          ))}
        </ul>
      {/* )} */}
    </div>
  );
};

export default Answers;
