export default function TermsPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
            <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
                Terms of Service
            </h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: July 2026</p>

            <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl divide-y divide-gray-100 dark:divide-neutral-800">

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Acceptance of Terms</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">By creating an account or using GateDrop, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">User Roles</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">GateDrop has two user roles:</p>
                    <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        <li><span className="font-medium text-black dark:text-white">Buyers</span> — can browse, purchase, and download digital products</li>
                        <li><span className="font-medium text-black dark:text-white">Sellers</span> — can list, manage, and sell digital products on the platform</li>
                    </ul>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Your selected role determines the features available in your account.</p>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Seller Responsibilities</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        <li>You must have full rights to sell any content you list on GateDrop</li>
                        <li>Product descriptions must be accurate and not misleading</li>
                        <li>You are solely responsible for the quality of your products</li>
                        <li>You may not sell illegal, harmful, or infringing content</li>
                        <li>Products with existing purchases cannot be deleted — they may only be unpublished</li>
                        <li>GateDrop reserves the right to remove any product that violates these terms</li>
                    </ul>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Intellectual Property</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Sellers retain ownership of the intellectual property rights to the content
                        they upload. By listing products on GateDrop, sellers grant GateDrop a
                        limited, non-exclusive license to display, promote, and distribute their
                        products through the platform for the purpose of operating the marketplace.
                    </p>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Payments and Commission</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Payments are processed securely by Razorpay. GateDrop charges a
                        <span className="font-medium text-black dark:text-white"> 10% platform commission </span>
                        on each sale. Sellers receive 90% of the product price. Earnings are
                        tracked in your seller dashboard and settled manually. Sellers will be
                        notified before any changes to the commission rate take effect.</p>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Purchases and Refunds</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        <li>All sales are final once a purchase is completed</li>
                        <li>Buyers receive instant download access upon successful payment</li>
                        <li>Please review product descriptions carefully before purchasing</li>
                        <li>Refund requests are handled on a case-by-case basis — contact support within 7 days of purchase</li>
                    </ul>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Prohibited Content</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">The following content is strictly prohibited on GateDrop:</p>
                    <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        <li>Content that infringes on intellectual property rights</li>
                        <li>Malware, viruses, or harmful software</li>
                        <li>Illegal content of any kind</li>
                        <li>Adult or explicit content</li>
                        <li>Content that promotes violence, hatred, or discrimination</li>
                    </ul>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Account Termination</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        GateDrop reserves the right to suspend or terminate accounts that violate
                        these terms without prior notice. To request account deletion, contact us through our{" "}
                        <a href="/contact" className="text-black dark:text-white font-medium hover:underline">
                            Contact page
                        </a>.
                        Note that seller accounts with existing purchases cannot be fully removed —
                        your account will be deactivated but your products will remain accessible
                        to buyers who have already purchased them.
                    </p>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Limitation of Liability</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">GateDrop is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from use of the platform, including disputes, data loss, or issues arising between buyers and sellers.</p>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Changes to Terms</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">We may update these Terms of Service at any time. Continued use of GateDrop after changes constitutes acceptance. We will notify users of significant changes via email where possible.</p>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Contact</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">For terms-related questions contact us through our <a href="/contact" className="text-black dark:text-white font-medium hover:underline">Contact page</a>.</p>
                </section>

            </div>
        </div>
    )
}