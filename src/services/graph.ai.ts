import { StateSchema, MessagesValue,  StateGraph, START, END } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

const State = new StateSchema({
  messages: MessagesValue,
});

type judgemnent = {
    winner: "tie" | "solution1" | "solution2",
    solution1_score: number,
    solution2_score: number,
}

type Aistate = {
  messages: typeof MessagesValue,
  solution1: string,
    solution2: string,
  judgemnent: judgemnent
}

const state: Aistate = {
    messages: MessagesValue,
    solution1: "",
    solution2: "",
    judgemnent: {
        winner: "solution1",
        solution1_score: 0,
        solution2_score: 0,
    }
}
