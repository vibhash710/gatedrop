export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
            <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
                Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 mb-8">Last updated: July 2026</p>

            <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-xl divide-y divide-gray-100 dark:divide-neutral-800">

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Introduction</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">GateDrop ("we", "our", or "us") operates the GateDrop marketplace. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your personal information.</p>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Information We Collect</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        <li><span className="font-medium text-black dark:text-white">Account information</span> — name, email address, profile image, and authentication method (email/password, Google, or GitHub)</li>
                        <li><span className="font-medium text-black dark:text-white">Role information</span> — whether you are a Buyer or Seller on our platform</li>
                        <li><span className="font-medium text-black dark:text-white">Product data</span> — for sellers: product titles, descriptions, prices, cover images, and uploaded files</li>
                        <li><span className="font-medium text-black dark:text-white">Purchase records</span> — purchased products, transaction identifiers, purchase history, and timestamps</li>
                        <li><span className="font-medium text-black dark:text-white">Payment information</span> — payments are processed by Razorpay. We never store your card, UPI, or banking details on our servers</li>
                    </ul>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">How We Use Your Information</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        <li>To provide and maintain the GateDrop platform</li>
                        <li>To authenticate your account and maintain your session</li>
                        <li>To process purchases and grant file download access</li>
                        <li>To display your products if you are a seller</li>
                        <li>To calculate seller earnings and maintain transaction records.</li>
                        <li>To send transactional emails related to your purchases</li>
                    </ul>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">File Storage</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Product files and cover images are stored securely via UploadThing. Access to product files is restricted — only verified purchasers and the seller can access a product's downloadable file. Files are served via time-limited signed URLs.</p>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Third-Party Services</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">We use the following third-party services which have their own privacy policies:</p>
                    <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        <li><span className="font-medium text-black dark:text-white">Razorpay</span> — payment processing</li>
                        <li><span className="font-medium text-black dark:text-white">UploadThing</span> — file storage</li>
                        <li><span className="font-medium text-black dark:text-white">Neon</span> — database hosting</li>
                        <li><span className="font-medium text-black dark:text-white">Vercel</span> — application hosting</li>
                        <li><span className="font-medium text-black dark:text-white">Google / GitHub</span> — OAuth authentication (if used)</li>
                    </ul>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Cookies</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        GateDrop uses cookies and similar technologies to provide essential
                        functionality, such as keeping you signed in, maintaining your session,
                        remembering your preferences, and improving the overall user experience.
                        Most browsers allow you to control or disable cookies through their
                        settings. Disabling cookies may affect certain features of the platform.
                    </p>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Data Retention</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">We retain your account data for as long as your account is active. Purchase records may be retained for as long as necessary to provide access to purchased products, comply with legal obligations, and resolve disputes. You may request deletion of your account by contacting us.</p>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Your Rights</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        <li>Access the personal data we hold about you</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Request deletion of your account and associated data</li>
                        <li>Withdraw consent for data processing where applicable</li>
                    </ul>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Changes to This Policy</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">We may update this Privacy Policy from time to time. The "Last updated" date at the top reflects the most recent revision. Continued use of GateDrop after changes constitutes acceptance of the updated policy.</p>
                </section>

                <section className="p-6">
                    <h2 className="text-base font-semibold text-black dark:text-white mb-2">Contact</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">For privacy-related questions, contact us through our <a href="/contact" className="text-black dark:text-white font-medium hover:underline">Contact page</a>.</p>
                </section>

            </div>
        </div>
    )
}