<?php

namespace App\Filament\Resources;

use App\Domain\Billing\Models\Plan;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;

use Filament\Support\Icons\Heroicon;

use BackedEnum;
use UnitEnum;

class PlanResource extends Resource
{
    protected static ?string $model = Plan::class;

    protected static BackedEnum|string|null $navigationIcon = Heroicon::OutlinedCurrencyDollar;
    protected static UnitEnum|string|null $navigationGroup = 'Users & Billing';

    // ✅ FORM (v5)
    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),

                TextInput::make('slug')
                    ->required()
                    ->unique(ignoreRecord: true),

                TextInput::make('price')
                    ->numeric()
                    ->required(),

                TextInput::make('currency')
                    ->default('usd'),

                TextInput::make('interval')
                    ->default('month'),

                TextInput::make('max_websites')
                    ->numeric()
                    ->required(),

                TextInput::make('stripe_price_id')
                    ->label('Stripe Price ID'),

                Textarea::make('features')
                    ->placeholder('["10 websites","Premium templates"]')
                    ->columnSpanFull(),

                Toggle::make('is_active')
                    ->default(true),

                Toggle::make('is_popular')
                    ->label('Most Popular'),
            ])
            ->columns(2);
    }

    // ✅ TABLE (v5)
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable(),

                TextColumn::make('price')
                    ->money('usd')
                    ->sortable(),

                TextColumn::make('interval')
                    ->badge(),

                TextColumn::make('max_websites'),

                TextColumn::make('is_active')
                    ->boolean(),

                TextColumn::make('is_popular')
                    ->boolean(),

                TextColumn::make('created_at')
                    ->dateTime(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }
}