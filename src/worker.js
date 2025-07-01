import {pipeline, TextStreamer } from '@huggingface/transformers'

class MyTranslationPipeline {
    static task = 'sentiment-analysis'
    static model = 'Xenova/bert-base-multilingual-uncased-sentiment'
    static instance = null

    static async getInstance(progress_callback = null) {
        this.instance ??= pipeline(this.task, this.model, {progress_callback});
        return this.instance
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
  // Retrieve the translation pipeline. When called for the first time,
  // this will load the pipeline and save it for future use.
  const summarizer = await MyTranslationPipeline.getInstance(x => {
      // We also add a progress callback to the pipeline so that we can
      // track model loading.
      self.postMessage(x);
  });

  // Capture partial output as it streams from the pipeline
  const streamer = new TextStreamer(summarizer.tokenizer, {
      skip_prompt: true,
      skip_special_tokens: true,
      callback_function: function (text) {
          self.postMessage({
              status: 'update',
              output: text
          });
      }

      
  });

  // Actually perform the translation
  const output = await summarizer(event.data.text, {
      tgt_lang: event.data.text,
    //   src_lang: event.data.src_lang,

      // Allows for partial output to be captured
      streamer,
  });

  console.log(output)

  // Send the output back to the main thread
  self.postMessage({
      status: 'complete',
      output,
  });
});

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

// const pipe3 = await pipeline('summarization','Xenova/distilbart-cnn-6-6') 
// const out33 =  await pipe3("\u201cEveryone I know has a closet full of black clothes,\u201d wrote the late writer and director Nora Ephron in an essay called On Maintenance. I don\u2019t like to propagate cliches, but requests for tips on how to prevent black clothes from fading have far outnumbered any others in this series. So here is some expert advice on how to maintain the black items in your wardrobe because, as Ephron wrote,\u201dblack makes your life so much simpler. Everything matches black, especially black.\u201d Wash less and with care Sally Hughes, the founder of Kair laundry products, says to prevent black clothes from fading your washing machine setting is key, \u201cyou want to agitate the garment as little as possible\u201d. She recommends turning the garment inside out and washing on a cold, gentle cycle with a liquid detergent and avoiding tumble drying. Rebecca Van Amber, a textile scientist from Royal Melbourne Institute of Technology University, agrees. She advises to wash black clothes in the machine infrequently, as the agitation and water causes the dye to come out of the garment, especially with natural fibres. \u201cDifferent types of fibres interact with water differently,\u201d Van Amber explains, and this affects how they are dyed and how colour-fast the dyes are. For instance, because natural fibres are very absorbent, the dye used is very soluble, \u201cso when you put them in the washing machine the dye will come out of the garment\u201d. She says synthetic fibres have a different relationship with water and because of this they shouldn\u2019t fade as much. The dye used for fabrics such as polyester and nylon tends to be more stable than natural fibres because they are less absorbent. Some of the dyes and techniques applied to them \u201cdon\u2019t use any water, they might be dyed more in a fibre stage than a garment stage\u201d. Since it\u2019s important to wash black clothes infrequently to retain the depth of colour, fashion designer Bianca Spender suggests spot cleaning with \u201ca small amount of non-comedogenic soap on a toothbrush with some water\u201d. Van Amber suggests pre-treating problem areas, such as where marks might be left by deodorant, with a stain stick before washing them. Or using \u201ca fabric refreshing spray that you lightly mist before leaving it to air\u201d. Stay away from sun and damp Van Amber says when drying black clothes be sure to keep them out of the sun. \u201cUV light is the most powerful fading agent for clothing. If you want your colours to stay bright don\u2019t hang things outside on the line in direct sunlight.\u201d Spender warns that tailoring and coats are susceptible to mould, so \u201cit is important to store your clothing in an aerated space that is protected from dampness and moths\u201d. She recommends using a natural moth repellent such as lavender. Quick refreshes Spender recommends bringing textured knit fabrics back to life by using a clothing brush. For special garments such as silk evening dresses, she suggests wearing a makeup scarf when taking them on and off, to prevent marks from happening in the first place. A handy tip if marks do occur: \u201cYou can remove marks on crepe by rubbing the fabric against itself.\u201d Faded black garments can be over-dyed at home using a Rit Dye but there are a few things to keep in mind. Photograph: iStock Fixing fading If you\u2019re particularly crafty and resourceful, Van Amber says faded black garments can be over-dyed at home using a Rit Dye but there are a few things to keep in mind. Natural fibres such as cotton, linen or silk will take dye better than synthetics such as polyester or nylon. She says be sure to wear protective gloves and a mask and to use a plastic tub so you don\u2019t turn your bathtub black. \u201cThe most important thing is to make sure the garment is wet before you dye it,\u201d she says, and once it\u2019s in the pot, make sure you are continuously stirring it and keeping the water moving because otherwise \u201cyou\u2019ll end up with a streaky garment\u201d. Spender also recommends home dyeing \u201cin a big soup pot\u201d. Or for favourite garments where dyeing is too risky, she says, \u201canother option is to wear faded blacks with prints, florals or lighter tones\u201d. Echoing Ephron\u2019s sentiment that everything matches black \u2013 even faded black. \u2013 Guardian")

// console.log(out)
// console.log(out22)


// console.log(out33)
// [{'label': 'POSITIVE', 'score': 0.999817686}]