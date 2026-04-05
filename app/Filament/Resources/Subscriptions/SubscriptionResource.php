<?php

namespace App\Filament\Resources\Subscriptions;

use App\Domain\Billing\Models\Subscription;
use Filament\Resources\Resource;

use Filament\Schemas\Schema;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DatePicker;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Support\Icons\Heroicon;

use BackedEnum;
use UnitEnum;

class SubscriptionResource extends Resource
{
    protected static ?string $model = Subscription::class;

    // Navigation
    protected static BackedEnum|string|null $navigationIcon = Heroicon::OutlinedCreditCard;
    protected static UnitEnum|string|null $navigationGroup = 'Users & Billing';

    protected static ?string $recordTitleAttribute = 'stripe_id';

    // ✅ FORM (Filament v5)
    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_id')
                    ->label('User ID')
                    ->required()
                    ->numeric(),

                Select::make('type')
                    ->options([
                        'one_time' => 'One Time',
                        'subscription' => 'Subscription',
                    ])
                    ->required(),

                TextInput::make('stripe_id')
                    ->label('Stripe ID')
                    ->required(),

                TextInput::make('stripe_status')
                    ->required(),

                TextInput::make('stripe_price')
                    ->label('Price ID')
                    ->required(),

                TextInput::make('quantity')
                    ->numeric()
                    ->required(),

                DatePicker::make('trial_ends_at'),

                DatePicker::make('ends_at'),
            ])
            ->columns(2);
    }

    // ✅ TABLE
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')
                    ->label('User')
                    ->searchable(),

                TextColumn::make('type')
                    ->sortable()
                    ->badge(),

                TextColumn::make('stripe_status')
                    ->sortable()
                    ->badge(),

                TextColumn::make('stripe_price')
                    ->label('Price ID')
                    ->sortable(),

                TextColumn::make('quantity')
                    ->sortable(),

                TextColumn::make('trial_ends_at')
                    ->date(),

                TextColumn::make('ends_at')
                    ->date(),

                TextColumn::make('created_at')
                    ->dateTime(),
            ])
            ->actions([
                EditAction::make(),
            ])
            ->bulkActions([
                DeleteBulkAction::make(),
            ]);
    }

    // Relations
    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    // Pages
    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSubscriptions::route('/'),
            'create' => Pages\CreateSubscription::route('/create'),
            'edit' => Pages\EditSubscription::route('/{record}/edit'),
        ];
    }
}