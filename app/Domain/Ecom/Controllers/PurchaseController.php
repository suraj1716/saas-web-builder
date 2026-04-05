<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'template_id' => 'required|exists:templates,id',
        ]);

        $purchase = Purchase::create([
            'template_id' => $request->template_id,
            'user_id' => auth()->id() ?? 1, // replace with real user
            'status' => 'pending',
        ]);

        return $purchase;
    }
}