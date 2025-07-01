import { useState, useRef, useEffect } from 'react'
import './App.css'
import LanguageSelector from './components/LanguageSelector';
import Progress from './components/Progress';
import { pipeline } from '@huggingface/transformers'
import ModelSelector from './components/ModelSelector';
import { MODEL } from './constant';
import { default as axios } from 'axios';
import Answers from './components/Answers';

function App() {
  // const [count, setCount] = useState(0)
  const [ready, setReady] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [progressItems, setProgressItems] = useState([]);

  // Inputs and outputs
  const [input, setInput] = useState('What is the latest news on NASA?');
  const [sourceLanguage, setSourceLanguage] = useState('eng_Latn');
  const [targetLanguage, setTargetLanguage] = useState('fra_Latn');
  const [selectedModel, setSelectedModel] = useState(MODEL.MIXED_BREAD_AI)
  const [searchResult, setSearchResult] = useState([])
  const [output, setOutput] = useState('');


  const worker = useRef(null);

  useEffect(() => {
    worker.current ??= new Worker(new URL('./worker.js', import.meta.url), {
      type: 'module'
    })
    

  const onMessageReceived = (e) => {
  switch (e.data.status) {
    case 'initiate':
      // Model file start load: add a new progress item to the list.
      setReady(false);
      setProgressItems(prev => [...prev, e.data]);
      break;

    case 'progress':
      // Model file progress: update one of the progress items.
      setProgressItems(
        prev => prev.map(item => {
          if (item.file === e.data.file) {
            return { ...item, progress: e.data.progress }
          }
          return item;
        })
      );
      break;

    case 'done':
      // Model file loaded: remove the progress item from the list.
      setProgressItems(
        prev => prev.filter(item => item.file !== e.data.file)
      );
      break;

    case 'ready':
      // Pipeline ready: the worker is ready to accept messages.
      setReady(true);
      break;

    case 'update':
      // Generation update: update the output text.
      setOutput(o => o + e.data.output);
      break;

    case 'complete':
      // Generation complete: re-enable the "Translate" button
      setDisabled(false);
      break;
  }
};
    
    worker.current.addEventListener('message', onMessageReceived)
    
    return () => worker.current.removeEventListener('message', onMessageReceived)
    
  });

  const translate = () => {
     setDisabled(true);
  setOutput('');
  worker.current.postMessage({
    text: input,
    src_lang: sourceLanguage,
    tgt_lang: targetLanguage,
  });
  }

  const getResults = () => {

    console.log(input)
    if (!input) {
        alert('Empty input')
        return
    }

    axios.post('http://localhost:3000/search', {
      model:"Xenova",
      query: ""
    }).then(response => {
      console.log(response)
      setSearchResult(response.data.points)
    }).catch(err => {
      console.log(err)
    })

  }
  return (
   <>
    <h1 className='text-red-400'>Transformers.js</h1>
    <h2>ML-powered semantic search!</h2>

    <div className=''>
      <div className=''>
        <ModelSelector onChange={x => setSelectedModel(x.target.value)} />
      </div>

      <div className=''>
        {/* <textarea value={input} rows={3} onChange={e => setInput(e.target.value)}></textarea> */}
        {/* <textarea value={output} rows={3} readOnly></textarea> */}
        <div class="flex flex-col my-4">
          {/* <label for="" class="form-label">Name</label> */}
          <input
            type="text"
            className=" mb-3 bg-gray-100 p-3 w-100"
            name=""
            id=""
            aria-describedby="helpId"
            placeholder=""
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <small id="helpId" className="">Help text</small>
        </div>
        
      </div>
    </div>

    <button disabled={disabled} onClick={getResults}>Search</button>

    <div className='progress-bars-container'>
      {ready === false && (
        <label>Loading models... (only run once)</label>
      )}
      {progressItems.map(data => (
        <div key={data.file}>
          <Progress text={data.file} percentage={data.progress} />
        </div>
      ))}
    </div>

    <Answers answers={searchResult} question={input} />
  </>
  )
}

export default App
