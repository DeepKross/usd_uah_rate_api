export interface RateRequest {
  from: string;
  to: string;
}

export interface Rate {
  [key: string]: string;
}

export type Rates = Record<string, string>;

//this is basic full response from API, can be used for more complex operations in future
export interface RateData {
  meta: {
    code: number;
    disclaimer: string;
  };
  date: string;
  base: string;
  rates: Rates;
  response: {
    date: string;
    base: string;
    rates: Rates;
  };
}
