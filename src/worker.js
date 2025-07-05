import {pipeline, TextStreamer } from '@huggingface/transformers'

// class MyTranslationPipeline {
//     static task = 'sentiment-analysis'
//     static model = 'Xenova/bert-base-multilingual-uncased-sentiment'
//     static instance = null

//     static async getInstance(progress_callback = null) {
//         this.instance ??= pipeline(this.task, this.model, {progress_callback}, );
//         return this.instance
//     }
// }

class MySummarizationPipeline {
    static task = 'summarization'
    static model = 'Xenova/distilbart-cnn-6-6'
    static instance = null

    static async getInstance() {
        this.instance ??= pipeline(this.task, this.model);
        return this.instance
    }

    // static async getSummary(desc) {
    //     await this.instance(desc)
    // }

}

class MySentimentPipeline {
    static task = "sentiment-analysis"
    static model = "Xenova/bert-base-multilingual-uncased-sentiment"
    static instance = null

    static async getInstance() {
        this.instance ??= pipeline(this.task, this.model);
        return this.instance
    }
}


export const haveSummary = await MySummarizationPipeline.getInstance()

export const getSentiment = await MySentimentPipeline.getInstance()
// console.log(dd)

// // Listen for messages from the main thread
// self.addEventListener('message', async (event) => {
//   // Retrieve the translation pipeline. When called for the first time,
//   // this will load the pipeline and save it for future use.
//   const summarizer = await MyTranslationPipeline.getInstance(x => {
//       // We also add a progress callback to the pipeline so that we can
//       // track model loading.
//       self.postMessage(x);
//   });

//   // Capture partial output as it streams from the pipeline
//   const streamer = new TextStreamer(summarizer.tokenizer, {
//       skip_prompt: true,
//       skip_special_tokens: true,
//       callback_function: function (text) {
//           self.postMessage({
//               status: 'update',
//               output: text
//           });
//       }

      
//   });

//   // Actually perform the translation
//   const output = await summarizer(event.data.text, {
//       tgt_lang: event.data.text,
//     //   src_lang: event.data.src_lang,

//       // Allows for partial output to be captured
//       streamer,
//   });

//   console.log(output)

//   // Send the output back to the main thread
//   self.postMessage({
//       status: 'complete',
//       output,
//   });
// });

//   const pipe1 = await pipeline('sentiment-analysis', 'Xenova/bert-base-multilingual-uncased-sentiment');

//   const out1 = await pipe1('I am alright walking my dog.');
//  const out2 = await pipe1('I am hate walking my dog.');
//   console.log(out1)
//   console.log(out2)

// //   import { pipeline } from '@huggingface/transformers';

// // Allocate a pipeline for sentiment-analysis
// const pipe = await pipeline('sentiment-analysis','Xenova/distilbert-base-uncased-finetuned-sst-2-english');

// const out = await pipe('I am alright walking my dog.');
//  const out22 = await pipe('I am hate walking my dog.');

// export const summarizationPipe = await pipeline('summarization','Xenova/distilbart-cnn-6-6') 


// console.log(out)
// console.log(out22)

//     const out55 = await summarizationPipe("Everyone I know has a closet full of black clothes,\u201d wrote the late writer and director Nora Ephron in an essay called On Maintenance. I don\u2019t like to propagate cliches, but requests for tips on how to prevent black clothes from fading have far outnumbered any others in this series. So here is some expert advice on how to maintain the black items in your wardrobe because, as Ephron wrote,\u201dblack makes your life so much simpler. Everything matches black, especially black.\u201d Wash less and with care Sally Hughes, the founder of Kair laundry products, says to prevent black clothes from fading your washing machine setting is key, \u201cyou want to agitate the garment as little as possible\u201d")



// console.log(out55)
// [{'label': 'POSITIVE', 'score': 0.999817686}]