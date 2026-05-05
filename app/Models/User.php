<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use App\Models\UserUsage;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Domain\Websites\Models\Website;
use App\Domain\Billing\Models\Subscription;
use App\Models\SavedTemplate;
use App\Models\TemplatePurchase;
use App\Domain\Media\Models\Media;
use App\Domain\Billing\Models\Plan;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, Billable ;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_admin'          => 'boolean',
            'password'          => 'hashed',
        ];
    }

      // Auto-create usage row when user is created
      protected static function booted(): void
      {
          static::created(function (User $user) {
              UserUsage::create([
                  'user_id'            => $user->id,
                  'storage_bytes_used' => 0,
                  'websites_count'     => 0,
                  'template_slots_used'=> 0,
              ]);
          });
      }

      public function usage(): HasOne
      {
          return $this->hasOne(UserUsage::class);
      }

    public function canAccessProTemplates(): bool
{
    return $this->subscribed('default', 'pro'); // assuming 'pro' plan in Stripe
}

  // ✅ Get active subscription
  public function subscription()
  {
      return $this->hasOne(Subscription::class);
  }

  // ✅ Get current plan
  public function plan()
  {
      return $this->subscription?->plan;
  }


  public function websites(): HasMany
  {
      return $this->hasMany(Website::class);
  }

  public function savedTemplates(): HasMany
  {
      return $this->hasMany(SavedTemplate::class);
  }

  public function templatePurchases(): HasMany
  {
      return $this->hasMany(TemplatePurchase::class);
  }

  public function media(): HasMany
  {
      return $this->hasMany(Media::class);
  }

  // ── Plan helpers ───────────────────────────────

  // Get the user's active plan from subscriptions
  public function activePlan(): ?Plan
  {
      $subscription = $this->subscription('default');

      if (! $subscription || ! $subscription->active()) {
          return Plan::where('slug', 'free')->first();
      }

      return Plan::where('stripe_price_id', $subscription->stripe_price)->first()
          ?? Plan::where('slug', 'free')->first();
  }

  // Has the user purchased a specific template one-time?
  public function hasPurchasedTemplate(int $templateId): bool
  {
      return $this->templatePurchases()
          ->where('template_id', $templateId)
          ->where('status', 'paid')
          ->exists();
  }


}
