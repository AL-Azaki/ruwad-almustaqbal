<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'location' => 'required|string|max:255',
            'service_type' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $order = Order::create($validated);
        return response()->json(['message' => 'Order created successfully', 'order' => $order], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,pending,in_progress,completed,cancelled'
        ]);

        $order = Order::findOrFail($id);
        $order->status = $validated['status'];
        $order->save();

        return response()->json($order);
    }
}
