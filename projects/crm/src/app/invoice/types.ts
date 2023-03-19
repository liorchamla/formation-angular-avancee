import { FormArray, FormControl, FormGroup } from '@angular/forms';

/**
 * Nous créons ce type car dans plusieurs composants de notre application, nous utilisons
 * un formulaire et nous ne souhaitons pas typer à chaque fois
 *
 * Il représente le formulare d'une facture
 */
export type InvoiceFormType = FormGroup<{
  customer_name: FormControl;
  description: FormControl;
  status: FormControl;
  details: FormArray<
    FormGroup<{
      amount: FormControl;
      quantity: FormControl;
      description: FormControl;
    }>
  >;
}>;

/**
 * Représente un détail au sein d'une facture
 */
export type InvoiceDetail = {
  amount: number;
  quantity: number;
  description: string;
};

/**
 * Représente une facture telle que notre backend la voit
 */
export type Invoice = {
  id?: number;
  created_at?: number;
  customer_name: string;
  description: string;
  status: 'SENT' | 'PAID' | 'CANCELED';
  details: InvoiceDetail[];
};
