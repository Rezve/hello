import { Chatter } from "./chatter";
import { ChromaDB } from "./chroma-db";
import { Trainer } from "./trainer";


(async() => {
    const db = new ChromaDB();
    const files = [
        'pmp-guideline.txt'
    ]

    // first time only or this can be a separate one time operation
    const trainer = new Trainer();
    await trainer.train(files);   

    // start asking question from pmp guideline
    const chatter = new Chatter(db);
    chatter.ask();
})()