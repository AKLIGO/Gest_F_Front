export interface CheckResponseDTO {
  tx_reference: string;
  payment_reference: string;
  datetime: string;
  identifier: string;
  payment_method: string;
  phone_number: string;
  status: number;
}
