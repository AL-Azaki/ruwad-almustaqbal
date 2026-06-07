<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingController extends Controller
{
    public function index()
    {
        // Cache settings for 24 hours to optimize database load
        $settings = Cache::remember('app_settings', 60 * 60 * 24, function () {
            return Setting::all()->pluck('value', 'key');
        });

        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $data = $request->all();
        
        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        // Clear the cache after updating
        Cache::forget('app_settings');

        return response()->json(['message' => 'Settings updated successfully']);
    }
}
