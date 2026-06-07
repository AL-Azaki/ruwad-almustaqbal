<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    // Public: get only approved testimonials
    public function index()
    {
        $testimonials = Testimonial::where('is_approved', true)->latest()->get();
        return response()->json($testimonials);
    }

    // Public: submit a new testimonial
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'text' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        // New testimonials are NOT approved by default
        $validated['is_approved'] = false;

        $testimonial = Testimonial::create($validated);

        return response()->json([
            'message' => 'Testimonial submitted successfully and is pending approval.',
            'testimonial' => $testimonial
        ], 201);
    }

    // Admin: get all testimonials
    public function adminIndex()
    {
        $testimonials = Testimonial::latest()->get();
        return response()->json($testimonials);
    }

    // Admin: approve or unapprove
    public function toggleApprove($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->is_approved = !$testimonial->is_approved;
        $testimonial->save();

        return response()->json([
            'message' => 'Testimonial approval status toggled',
            'testimonial' => $testimonial
        ]);
    }

    // Admin: update testimonial
    public function update(Request $request, $id)
    {
        $testimonial = Testimonial::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'text' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'is_approved' => 'boolean'
        ]);

        $testimonial->update($validated);

        return response()->json([
            'message' => 'Testimonial updated successfully',
            'testimonial' => $testimonial
        ]);
    }

    // Admin: delete testimonial
    public function destroy($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->delete();

        return response()->json(['message' => 'Testimonial deleted']);
    }
}
