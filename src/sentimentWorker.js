import {pipeline } from '@huggingface/transformers'


class MySentimentPipeline {
    static task = "sentiment-analysis"
    static model = "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
    static instance = null

    static async getInstance() {
        this.instance ??= pipeline(this.task, this.model);
        return this.instance
    }
}



// export const getSentiment = null
// console.log(dd)


self.addEventListener('message', async (event) => {
    console.log(event.data)
    const getSentiment = await MySentimentPipeline.getInstance(x => {
        self.postMessage(x)
    })

    let output = null
    if(event.data.titles) {
        output = await getSentiment(event.data.titles)

    }

    self.postMessage({
        status: 'complete',
        output
    })
})
