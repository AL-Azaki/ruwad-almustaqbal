<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AuthController;

use App\Http\Controllers\SettingController;
use App\Http\Controllers\Api\TestimonialController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public API Routes (For React Frontend)
Route::post('/login', [AuthController::class, 'login']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/projects', [ProjectController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/settings', [SettingController::class, 'index']);
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::post('/testimonials', [TestimonialController::class, 'store']);

// Protected API Routes (For Admin Dashboard)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/settings', [SettingController::class, 'update']);
    
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{id}', [ServiceController::class, 'update']);
    Route::patch('/services/{id}/status', [ServiceController::class, 'updateStatus']);
    Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
    
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::post('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
    
    Route::get('/orders', [OrderController::class, 'index']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);

    Route::get('/admin/testimonials', [TestimonialController::class, 'adminIndex']);
    Route::put('/testimonials/{id}', [TestimonialController::class, 'update']);
    Route::patch('/testimonials/{id}/approve', [TestimonialController::class, 'toggleApprove']);
    Route::delete('/testimonials/{id}', [TestimonialController::class, 'destroy']);
});
