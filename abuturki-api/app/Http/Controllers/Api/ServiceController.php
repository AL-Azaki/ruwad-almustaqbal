<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;

class ServiceController extends Controller
{
    public function index()
    {
        // For admin dashboard we need all services
        $services = Service::all();
        return response()->json($services);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'nullable|string',
            'starting_price' => 'nullable|numeric',
            'status' => 'nullable|string',
        ]);

        if (!isset($validated['status'])) {
            $validated['status'] = 'active';
        }

        $service = Service::create($validated);
        return response()->json($service, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'nullable|string',
            'starting_price' => 'nullable|numeric',
            'status' => 'nullable|string',
        ]);

        $service = Service::findOrFail($id);
        $service->update($validated);
        
        return response()->json($service);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:active,inactive'
        ]);

        $service = Service::findOrFail($id);
        $service->status = $validated['status'];
        $service->save();

        return response()->json($service);
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();
        return response()->json(['message' => 'Service deleted successfully']);
    }
}
