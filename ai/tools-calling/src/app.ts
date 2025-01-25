import dotenv from 'dotenv';
import { Chatter } from "./chatter";

dotenv.config();

(async() => {
    const chatter = new Chatter();
    chatter.ask();
})()