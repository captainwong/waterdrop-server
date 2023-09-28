import Decimal from 'decimal.js';
import { ValueTransformer } from 'typeorm';

export class DecimalTransformer implements ValueTransformer {
  to(data?: Decimal): string | null {
    return data?.toString() ?? null;
  }

  from(data: string): Decimal | null {
    return data ? new Decimal(data) : null;
  }
}

export const DecimalToString = ({ value }) => {
  return value?.toFixed?.() || value.toString();
};
