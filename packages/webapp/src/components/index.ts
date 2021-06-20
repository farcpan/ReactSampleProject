/**
 * for Parent
 */
export interface SubData {
    id: number;
    text: string;
    data: string[];
    answer: number;
}
  
export interface Data {
    id: number;
    text: string;
    data: SubData[];
}

export { default as Parent } from "./Parent";
