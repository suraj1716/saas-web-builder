<?php

namespace App\Filament\Resources;

use App\Domain\Websites\Models\Website;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;

use Filament\Support\Icons\Heroicon;

use BackedEnum;
use UnitEnum;

class WebsiteResource extends Resource
{
    protected static ?string $model = Website::class;

    protected static BackedEnum|string|null $navigationIcon = Heroicon::OutlinedGlobeAlt;
    protected static UnitEnum|string|null $navigationGroup = 'Templates & Websites';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')->required(),

                TextInput::make('domain')->required(),

                Select::make('template_id')
                    ->relationship('template', 'name')
                    ->required(),

                Toggle::make('is_active')->default(true),
            ])
            ->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->sortable(),

                TextColumn::make('domain'),

                TextColumn::make('template.name')->label('Template'),

                TextColumn::make('is_active')->boolean(),

                TextColumn::make('created_at')->dateTime(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }
}