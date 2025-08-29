<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ImageProxyController extends Controller
{
    /**
     * Proxy image from external URL to avoid CORS issues
     */
    public function proxy(Request $request): StreamedResponse
    {
        $request->validate([
            'url' => 'required|url',
        ]);

        $imageUrl = $request->input('url');

        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'User-Agent' => 'CollabSpace/1.0',
                ])
                ->get($imageUrl);

            if (!$response->successful()) {
                abort(404, 'Image not found');
            }

            $contentType = $response->header('Content-Type');
            $contentLength = $response->header('Content-Length');

            return response()->stream(
                function () use ($response) {
                    echo $response->body();
                },
                200,
                [
                    'Content-Type' => $contentType,
                    'Content-Length' => $contentLength,
                    'Cache-Control' => 'public, max-age=3600',
                    'Access-Control-Allow-Origin' => '*',
                ]
            );

        } catch (\Exception $e) {
            Log::error('Image proxy error: ' . $e->getMessage());
            abort(500, 'Unable to fetch image');
        }
    }
}
