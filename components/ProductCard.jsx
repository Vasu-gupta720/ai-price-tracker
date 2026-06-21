"use client";

import { ExternalLink, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteProduct, getPriceHistory } from "@/app/auth/callback/action";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import PriceChart from "@/components/PriceChart";

function formatPrice(value, currencyCode) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Price unavailable";
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode || "USD",
    }).format(amount);
  } catch {
    return `${currencyCode || "USD"} ${amount.toFixed(2)}`;
  }
}

export default function ProductCard({ product }) {
  const productName = product.name || "Tracked product";
  const productUrl = product.url || "#";
  const imageUrl = product.image_url;

  const [deleting, setDeleting] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      const history = await getPriceHistory(product.id);
      setPriceHistory(history);
    }
    fetchHistory();
  }, [product.id]);

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteProduct(product.id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message || "Product deleted");
    }
    setDeleting(false);
  };

  return (
    <Card className="bg-white text-left overflow-hidden">
      {imageUrl ? (
        <div className="flex h-48 w-full items-center justify-center bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element -- Product images can come from arbitrary store domains. */}
          <img
            src={imageUrl}
            alt={productName}
            className="max-h-full max-w-full object-contain p-4"
          />
        </div>
      ) : null}

      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="line-clamp-2 text-base">{productName}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {product.currency || "USD"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Current price</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(product.curr_price, product.currency)}
          </p>
        </div>

        {/* Price History Chart */}
        <PriceChart priceHistory={priceHistory} currency={product.currency} />

        <div className="flex gap-2">
          <a
            href={productUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
          >
            <ExternalLink className="h-4 w-4" />
            View product
          </a>
          <Button
            variant="destructive"
            size="sm"
            className="h-9"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
