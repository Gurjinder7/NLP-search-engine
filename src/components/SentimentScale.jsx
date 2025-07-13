import { useEffect, useState } from "react";

const SentimentScale = ({sentiment}) => {
    console.log(sentiment)
    const [scale, setScale] = useState(0)
    const returnScale = (label) => {
    }
    useEffect(() => {
        setScale(Number(sentiment?.label.split(' ')[0]))
    },[])

    const returnStyle = () => {
        if(sentiment?.label === 'POSITIVE') {
            return "text-green-700"
        } else if(sentiment?.label === 'NEGATIVE') {
            return "text-red-700"
        } else {
            return "text-gray-500"
        }
    }
    return ( 
        <div className="mt-3 mb-5 ">
            <p className="flex flex-start gap-1"><span>Sentiment: </span><span className={`${returnStyle()} font-semibold !capitalize`}> {sentiment?.label}</span></p>
            {/* <div className="flex justify-between gap-3 text-sm mb-1">
                <span className="font-semibold">Negative</span>
                <span className="font-semibold">Neutral</span>
                <span className="font-semibold">Positive</span>
            </div> */}
            {/* <div style={{'width':`${scale*20}%`}} className="bg-blue-300 rounded-xl text-blue-500 h-[10px] text-[2px]">{sentiment.label}</div> */}
        </div>
     );
}
 
export default SentimentScale;