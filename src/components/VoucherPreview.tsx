import { useState } from "react";

type VoucherPreviewProps = {
  amounts: number[];
  disclaimer: string;
};

const formatPrice = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function VoucherPreview({ amounts, disclaimer }: VoucherPreviewProps) {
  const [amount, setAmount] = useState(amounts[0] ?? 0);

  return (
    <div className="voucher-preview">
      <div className="voucher-preview__card" aria-live="polite">
        <p>Rendezvous / Gift card</p>
        <strong>{formatPrice.format(amount)}</strong>
      </div>
      <label htmlFor="voucher-amount">Pilih nilai voucher</label>
      <select
        id="voucher-amount"
        name="voucher-amount"
        onChange={(event) => setAmount(Number(event.currentTarget.value))}
        value={amount}
      >
        {amounts.map((value) => (
          <option key={value} value={value}>{formatPrice.format(value)}</option>
        ))}
      </select>
      <p className="voucher-preview__disclaimer">{disclaimer}</p>
    </div>
  );
}
