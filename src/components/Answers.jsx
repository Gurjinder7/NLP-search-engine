import Highlighter from "react-highlight-words";
import {removeStopwords, eng} from 'stopword'

const Answers = ({answers, question}) => {
    console.log(answers)
    const arr = question.replace(/[^a-zA-Z0-9]/g, " ").trim().split(' ')
    console.log(removeStopwords(arr))
    return ( 
        <div>

                <ul>
            {answers.map( item => (
                <div key={item.id}>
                    <h3>{item.payload.title}</h3>
                    <div>
                        <p>Similarity score: {item.score}</p>
                    </div>
                    <div>
                        <p>Description: {item.payload.description}</p>
                        <Highlighter
    highlightClassName="YourHighlightClass"
    searchWords={removeStopwords(arr)}
    autoEscape={true}
    textToHighlight={item.payload.description}
  />

                    </div>
                    <div>

                    </div>

                </div>
            ))}
            </ul>
        </div>
     );
}
 
export default Answers;