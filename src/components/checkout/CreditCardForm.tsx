
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Lock } from 'lucide-react';

interface CreditCardFormProps {
  onSubmit: (cardData: CreditCardData) => void;
  isLoading?: boolean;
}

export interface CreditCardData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export function CreditCardForm({ onSubmit, isLoading = false }: CreditCardFormProps) {
  const [cardData, setCardData] = useState<CreditCardData>({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Kenya',
    },
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const validateCard = () => {
    const newErrors: Record<string, string> = {};
    
    // Card number validation (basic Luhn algorithm)
    const cardNumber = cardData.cardNumber.replace(/\s/g, '');
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      newErrors.cardNumber = 'Card number must be between 13-19 digits';
    }
    
    // Expiry date validation
    const [month, year] = cardData.expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12) {
      newErrors.expiryDate = 'Invalid expiry date';
    } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      newErrors.expiryDate = 'Card has expired';
    }
    
    // CVC validation
    if (cardData.cvc.length < 3 || cardData.cvc.length > 4) {
      newErrors.cvc = 'CVC must be 3-4 digits';
    }
    
    // Cardholder name validation
    if (cardData.cardholderName.trim().length < 2) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    
    // Billing address validation
    if (!cardData.billingAddress.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!cardData.billingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!cardData.billingAddress.zipCode.trim()) {
      newErrors.zipCode = 'Zip code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCard()) {
      onSubmit(cardData);
    }
  };

  const detectCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5') || (number.startsWith('2') && parseInt(number.substring(0, 4)) >= 2221 && parseInt(number.substring(0, 4)) <= 2720)) return 'Mastercard';
    return '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2">
          <Lock className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-800">Your payment information is secure and encrypted</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number *</Label>
        <div className="relative">
          <Input
            id="cardNumber"
            type="text"
            maxLength={19}
            placeholder="1234 5678 9012 3456"
            value={cardData.cardNumber}
            onChange={(e) => {
              const formatted = formatCardNumber(e.target.value);
              setCardData(prev => ({ ...prev, cardNumber: formatted }));
            }}
            className={errors.cardNumber ? 'border-red-500' : ''}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <CreditCard className="h-5 w-5 text-gray-400" />
          </div>
          {detectCardType(cardData.cardNumber) && (
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-xs font-medium">
              {detectCardType(cardData.cardNumber)}
            </div>
          )}
        </div>
        {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date *</Label>
          <Input
            id="expiryDate"
            type="text"
            maxLength={5}
            placeholder="MM/YY"
            value={cardData.expiryDate}
            onChange={(e) => {
              const formatted = formatExpiryDate(e.target.value);
              setCardData(prev => ({ ...prev, expiryDate: formatted }));
            }}
            className={errors.expiryDate ? 'border-red-500' : ''}
          />
          {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvc">CVC *</Label>
          <Input
            id="cvc"
            type="text"
            maxLength={4}
            placeholder="123"
            value={cardData.cvc}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setCardData(prev => ({ ...prev, cvc: value }));
            }}
            className={errors.cvc ? 'border-red-500' : ''}
          />
          {errors.cvc && <p className="text-sm text-red-500">{errors.cvc}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardholderName">Cardholder Name *</Label>
        <Input
          id="cardholderName"
          type="text"
          placeholder="John Doe"
          value={cardData.cardholderName}
          onChange={(e) => {
            setCardData(prev => ({ ...prev, cardholderName: e.target.value }));
          }}
          className={errors.cardholderName ? 'border-red-500' : ''}
        />
        {errors.cardholderName && <p className="text-sm text-red-500">{errors.cardholderName}</p>}
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Billing Address</h4>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              type="text"
              placeholder="123 Main Street"
              value={cardData.billingAddress.street}
              onChange={(e) => {
                setCardData(prev => ({
                  ...prev,
                  billingAddress: { ...prev.billingAddress, street: e.target.value }
                }));
              }}
              className={errors.street ? 'border-red-500' : ''}
            />
            {errors.street && <p className="text-sm text-red-500">{errors.street}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                placeholder="Nairobi"
                value={cardData.billingAddress.city}
                onChange={(e) => {
                  setCardData(prev => ({
                    ...prev,
                    billingAddress: { ...prev.billingAddress, city: e.target.value }
                  }));
                }}
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State/County</Label>
              <Input
                id="state"
                type="text"
                placeholder="Nairobi County"
                value={cardData.billingAddress.state}
                onChange={(e) => {
                  setCardData(prev => ({
                    ...prev,
                    billingAddress: { ...prev.billingAddress, state: e.target.value }
                  }));
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code *</Label>
              <Input
                id="zipCode"
                type="text"
                placeholder="00100"
                value={cardData.billingAddress.zipCode}
                onChange={(e) => {
                  setCardData(prev => ({
                    ...prev,
                    billingAddress: { ...prev.billingAddress, zipCode: e.target.value }
                  }));
                }}
                className={errors.zipCode ? 'border-red-500' : ''}
              />
              {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                type="text"
                value={cardData.billingAddress.country}
                onChange={(e) => {
                  setCardData(prev => ({
                    ...prev,
                    billingAddress: { ...prev.billingAddress, country: e.target.value }
                  }));
                }}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
