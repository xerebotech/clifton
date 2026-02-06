import React from 'react';

export function PropertyCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
            <div className="h-64 bg-gray-200" />
            <div className="p-6 space-y-4">
                <div className="h-8 bg-gray-200 w-1/3 rounded" />
                <div className="h-6 bg-gray-200 w-2/3 rounded" />
                <div className="h-4 bg-gray-200 w-1/2 rounded" />
                <div className="flex justify-between pt-4 border-t border-gray-100">
                    <div className="h-4 bg-gray-200 w-16 rounded" />
                    <div className="h-4 bg-gray-200 w-16 rounded" />
                    <div className="h-4 bg-gray-200 w-16 rounded" />
                </div>
                <div className="h-12 bg-gray-200 w-full rounded-xl mt-6" />
            </div>
        </div>
    );
}

export function PropertyDetailsSkeleton() {
    return (
        <div className="pt-24 animate-pulse">
            {/* Breadcrumb Skeleton */}
            <div className="bg-[#23312D] py-6">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="h-4 bg-white/20 w-64 rounded" />
                </div>
            </div>

            {/* Main Content Skeleton */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Image Gallery Skeleton */}
                            <div className="h-[500px] bg-gray-200 rounded-2xl" />

                            {/* Thumbnails Skeleton */}
                            <div className="flex gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-24 h-24 bg-gray-200 rounded-lg" />
                                ))}
                            </div>

                            {/* Info Skeleton */}
                            <div className="space-y-4">
                                <div className="h-6 bg-gray-200 w-32 rounded" />
                                <div className="h-10 bg-gray-200 w-2/3 rounded" />
                                <div className="h-12 bg-gray-200 w-1/3 rounded" />
                            </div>

                            {/* Features Skeleton */}
                            <div className="grid grid-cols-4 gap-4 p-6 bg-[#F2F0EB] rounded-xl">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="text-center space-y-2">
                                        <div className="h-6 w-6 bg-gray-300 rounded mx-auto" />
                                        <div className="h-8 bg-gray-300 w-12 rounded mx-auto" />
                                        <div className="h-4 bg-gray-300 w-16 rounded mx-auto" />
                                    </div>
                                ))}
                            </div>

                            {/* Description Skeleton */}
                            <div className="space-y-3">
                                <div className="h-6 bg-gray-200 w-48 rounded" />
                                <div className="h-4 bg-gray-200 w-full rounded" />
                                <div className="h-4 bg-gray-200 w-full rounded" />
                                <div className="h-4 bg-gray-200 w-3/4 rounded" />
                            </div>
                        </div>

                        {/* Right Column - Form Skeleton */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#F2F0EB] rounded-2xl p-6 space-y-4">
                                <div className="h-6 bg-gray-300 w-2/3 rounded" />
                                <div className="h-4 bg-gray-300 w-full rounded" />
                                <div className="h-12 bg-white rounded-lg" />
                                <div className="h-12 bg-white rounded-lg" />
                                <div className="h-12 bg-white rounded-lg" />
                                <div className="h-24 bg-white rounded-lg" />
                                <div className="h-12 bg-gray-300 w-full rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
