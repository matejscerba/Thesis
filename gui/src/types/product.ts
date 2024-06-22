export interface Product {
  id: number;
  name: string;
  price: number;
  price_no_vat: number;
  availability: string;
  attributes: { [key: string]: any };
}

export interface ProductExplanation {
  message: string;
}
