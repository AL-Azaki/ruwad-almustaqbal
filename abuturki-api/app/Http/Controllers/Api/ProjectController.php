<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::orderBy('created_at', 'desc')->get();
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,mp4,webm|max:102400', // max 100MB
            'image_url' => 'nullable|string',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('projects', 'public');
            $imagePath = '/storage/' . $path;
        } elseif (!empty($validated['image_url'])) {
            $imagePath = $validated['image_url'];
        }

        $project = Project::create([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'description' => $validated['description'],
            'image_path' => $imagePath,
        ]);
        
        // Trigger Webhook for n8n to post on Social Media
        // \Illuminate\Support\Facades\Http::post('YOUR_N8N_WEBHOOK_URL', $project->toArray());

        return response()->json($project, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,mp4,webm|max:102400',
            'image_url' => 'nullable|string',
        ]);

        $project = Project::findOrFail($id);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('projects', 'public');
            $project->image_path = '/storage/' . $path;
        } elseif (!empty($validated['image_url'])) {
            $project->image_path = $validated['image_url'];
        }

        $project->title = $validated['title'];
        $project->category = $validated['category'];
        $project->description = $validated['description'];
        $project->save();

        return response()->json($project);
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return response()->json(['message' => 'Project deleted successfully']);
    }
}
