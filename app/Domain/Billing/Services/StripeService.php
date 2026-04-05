namespace App\Domain\Billing\Services;

class StripeService
{
    public function plans()
    {
        return [
            [
                'name' => 'Starter',
                'price' => 1000,
                'price_id' => env('STRIPE_STARTER_PRICE'),
            ],
            [
                'name' => 'Pro',
                'price' => 5000,
                'price_id' => env('STRIPE_PRO_PRICE'),
            ],
            [
                'name' => 'Agency',
                'price' => 10000,
                'price_id' => env('STRIPE_AGENCY_PRICE'),
            ]
        ];
    }
}