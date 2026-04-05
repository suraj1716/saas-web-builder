<?php

namespace App\Filament\Resources\Templates;

use App\Domain\Templates\Models\Template;
use App\Domain\Billing\Models\Plan;

use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Pages\CreateRecord;
use Filament\Resources\Pages\EditRecord;

use Filament\Actions\EditAction;
use Filament\Actions\DeleteBulkAction;

// ✅ Import your Pages
use App\Filament\Resources\Templates\Pages\ListTemplates;
use App\Filament\Resources\Templates\Pages\CreateTemplate;
use App\Filament\Resources\Templates\Pages\EditTemplate;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Toggle;
use UnitEnum;
use Filament\Support\Icons\Heroicon;
use BackedEnum;
use Filament\Forms\Components\KeyValue;




    // ✅ Form (v5)

    use Filament\Resources\Form; // make sure this import exists

class TemplateResource extends Resource
{
    protected static ?string $model = Template::class;


    
    protected static BackedEnum|string|null $navigationIcon = Heroicon::OutlinedCreditCard;


    protected static UnitEnum|string|null $navigationGroup = 'Templates & Websites';
    protected static ?string $recordTitleAttribute = 'name';



public static function form(Schema $schema): Schema
{
    return $schema->schema([
        TextInput::make('name')
            ->label('Template Name')
            ->required(),

        TextInput::make('slug')
            ->required()
            ->unique(ignoreRecord: true),

        Textarea::make('description')
            ->label('Description'),

        TextInput::make('category')
            ->label('Category'),

            Select::make('tier')
            ->label('Subscription Tier')
            ->options([
                'basic' => 'Basic',
                'pro' => 'Pro',
                'enterprise' => 'Enterprise',
            ])
            ->required(),

        Select::make('business_category')
            ->label('Business Category')
            ->options([
                'restaurant' => 'Restaurant',
                'agency' => 'Agency',
                'portfolio' => 'Portfolio',
                'ecommerce' => 'Ecommerce',
            ])
            ->required(),

        FileUpload::make('preview_image')
            ->label('Preview Image')
            ->image(),

            Textarea::make('data')
            ->label('Template Data (JSON)')
            ->rows(15)
            ->required()
            // Show pretty JSON in editor
            ->formatStateUsing(function ($state) {
                if (is_array($state)) {
                    return json_encode($state, JSON_PRETTY_PRINT);
                }
        
                $decoded = json_decode($state, true);
                return is_array($decoded) ? json_encode($decoded, JSON_PRETTY_PRINT) : $state;
            })
            // Save compact JSON as array
            ->dehydrateStateUsing(function ($state) {
                $decoded = json_decode($state, true);
                return is_array($decoded) ? $decoded : [];
            }),

         Textarea::make('css')
    ->label('Template CSS (index.css)')
    ->rows(15)
    ->placeholder('.simple-template-1 { background: black; color: white; }')
    ->columnSpan('full'),

        Toggle::make('is_active')
            ->label('Active')
            ->default(true),
    ]);
}

    // ✅ Table (v5)
    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')->sortable()->searchable(),
            TextColumn::make('tier'),
            TextColumn::make('business_category'),
            IconColumn::make('is_active')->boolean(),
            TextColumn::make('created_at')->date(),
        ])
        ->actions([
            EditAction::make(),
        ])
        ->bulkActions([
            DeleteBulkAction::make(),
        ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListTemplates::route('/'),
            'create' => CreateTemplate::route('/create'),
            'edit' => EditTemplate::route('/{record}/edit'),
        ];
    }
}