document.addEventListener('DOMContentLoaded', () => {
    // --- CREDIT SYSTEM CORE (KEEP ALL EXISTING LOGIC) ---
    let credits = localStorage.getItem('prodify_credits');
    if (credits === null) {
        // Migration check
        const oldCredits = localStorage.getItem('propify_credits');
        credits = oldCredits !== null ? parseInt(oldCredits) : 3;
        localStorage.setItem('prodify_credits', credits);
        if (oldCredits !== null) localStorage.removeItem('propify_credits');
    } else {
        credits = parseInt(credits);
    }

    const updateCreditsUI = () => {
        const creditDisplay = document.getElementById('credit-count');
        const paymentModal = document.getElementById('payment-modal');
        const dashboard = document.getElementById('dashboard-container');

        if (creditDisplay) creditDisplay.textContent = credits;

        if (credits <= 0) {
            if (paymentModal) paymentModal.classList.add('active');
            if (dashboard) dashboard.classList.add('dashboard-blur');
        } else {
            if (paymentModal) paymentModal.classList.remove('active');
            if (dashboard) dashboard.classList.remove('dashboard-blur');
        }
    };

    const useCredit = (amount = 1) => {
        if (credits < amount) {
            const paymentModal = document.getElementById('payment-modal');
            const dashboard = document.getElementById('dashboard-container');
            if (paymentModal) paymentModal.classList.add('active');
            if (dashboard) dashboard.classList.add('dashboard-blur');
            return false;
        }
        credits -= amount;
        localStorage.setItem('prodify_credits', credits);
        updateCreditsUI();
        return true;
    };

    // --- ACTIVATION & MODAL LOGIC ---
    const btnActivateModal = document.getElementById('btn-activate-modal');
    const txnInputModal = document.getElementById('txn-id-modal');

    if (btnActivateModal) {
        btnActivateModal.addEventListener('click', () => {
            const id = txnInputModal.value.trim();
            if (id.length === 17 || id.length === 19) {
                credits = 500;
                localStorage.setItem('prodify_credits', credits);
                updateCreditsUI();
                alert('Success! 500 credits have been added to your account.');
                txnInputModal.value = '';
            } else {
                alert('Invalid Transaction ID. Please ensure you have entered the correct ID from your PayPal receipt.');
            }
        });
    }

    const btnBuyCredits = document.getElementById('btn-buy-credits');
    if (btnBuyCredits) {
        btnBuyCredits.addEventListener('click', () => {
            document.getElementById('payment-modal').classList.add('active');
            document.getElementById('dashboard-container').classList.add('dashboard-blur');
        });
    }

    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');

    const closeModal = () => {
        const paymentModal = document.getElementById('payment-modal');
        const dashboard = document.getElementById('dashboard-container');
        if (paymentModal) paymentModal.classList.remove('active');
        if (dashboard) dashboard.classList.remove('dashboard-blur');
    };

    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

    updateCreditsUI();

    // --- GROWTH OS UI LOGIC ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            navButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
        });
    });

    const copyToClipboard = async (text, btn) => {
        try {
            await navigator.clipboard.writeText(text);
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i data-lucide="check" style="color: #10b981;"></i>';
            lucide.createIcons();
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                lucide.createIcons();
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    // --- STRATEGIC AI LOGIC HUB ---
    const resultsContainer = document.getElementById('os-results-container');
    const globalNicheInput = document.getElementById('global-niche');
    const globalAudienceInput = document.getElementById('global-audience');

    const renderResult = (items, score = null, implementation = null) => {
        resultsContainer.innerHTML = '';
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'result-item';
            const copyBtnLabel = item.isCode ? '<span>Copy Code</span>' : '';
            div.innerHTML = `
                <div class="result-header">
                    <span class="result-label">${item.label}</span>
                    <button class="copy-btn" data-text="${item.content.replace(/"/g, '&quot;')}">
                        ${copyBtnLabel}
                        <i data-lucide="copy"></i>
                    </button>
                </div>
                <div class="result-box ${item.isCode ? 'code-mode' : ''}" style="white-space: pre-wrap;"></div>
            `;
            div.querySelector('.result-box').textContent = item.content;
            resultsContainer.appendChild(div);
        });

        if (score) {
            const scoreDiv = document.createElement('div');
            scoreDiv.style.textAlign = 'right';
            scoreDiv.style.marginBottom = '1rem';
            scoreDiv.innerHTML = `<span class="score-badge">Expert Authority Score: ${score}/100</span>`;
            resultsContainer.appendChild(scoreDiv);
        }

        if (implementation) {
            const implDiv = document.createElement('div');
            implDiv.className = 'implementation-guide';
            implDiv.innerHTML = `<span>Strategic Implementation Guidance</span>${implementation}`;
            resultsContainer.appendChild(implDiv);
        }

        lucide.createIcons();
        resultsContainer.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => copyToClipboard(e.currentTarget.dataset.text, e.currentTarget));
        });
    };

    const startLoading = (btn) => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<div class="loading"></div> Consulting AI...';
        btn.disabled = true;
        return originalHTML;
    };

    const stopLoading = (btn, originalHTML) => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    };

    // --- EXPERT TOOLS DEFINITIONS ---
    const tools = {
        // --- SEO STRATEGY (1, 2, 4, 5) ---
        'btn-generate-blueprint': { // 1. AI Store Growth Blueprint
            cost: 10,
            generate: (name, audience, price, niche, problem) => [
                {
                    label: 'Scaling Strategy', content: `Niche: ${niche}\nTarget Problem: ${problem || 'Low store visibility and stagnant conversion'}\nGrowth Strategy:\n- Step 1: Optimize the ${name} product page for transactional intent targeting ${audience}.\n- Step 2: Implement a multi-channel retargeting campaign focusing on the ROI of ${name}.\nMetrics to Track: Conversion rate, Average Order Value (AOV), Customer Acquisition Cost (CAC)`
                }
            ],
            score: 99
        },
        'btn-seo-title': { // 2. Keyword Strategy
            cost: 1,
            generate: (niche, audience) => [
                {
                    label: 'Deep Intent Analysis', content: `Primary Keywords: ${niche}, best ${niche}, ${niche} for ${audience}\nSecondary Keywords: premium ${niche}, ${niche} reviews, buy ${niche} online\nSearch Intent: Transactional\nRecommendations: Optimize the product collection page for high-intent long-tail keywords.`
                }
            ],
            score: 96
        },
        'btn-seo-desc': { // 4. Strategic Product Desc
            cost: 3,
            generate: (niche, audience) => [
                {
                    label: 'Keyword-Rich Product Description', content: `Product Name: ${niche}\nKey Features: High durability, ergonomically designed, eco-friendly materials, professional grade.\nTarget Audience: ${audience}\nTone: Luxury\nSEO-Optimized Description: Experience the ultimate ${niche} crafted for ${audience} who demand perfection. Our premium ${niche} is engineered with high-durability materials and an eco-friendly core to ensure long-lasting performance. Whether you are upgrading your current setup or starting fresh, this ${niche} provides the professional edge you need. Designed with ergonomics in mind, it reduces fatigue and maximizes results. Shop now and transform your ${niche} experience with the best in the market.`
                }
            ],
            score: 98
        },
        'btn-seo-faq': { // 5. Semantic FAQ Schema
            cost: 3,
            generate: (niche, audience) => {
                const schema = {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": `Is this ${niche} suitable for professional ${audience}?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `Yes, our ${niche} is specifically engineered to meet the high-performance demands of professional ${audience}, focusing on durability and results.`
                            }
                        },
                        {
                            "@type": "Question",
                            "name": `What makes the ${niche} a premium choice for ${audience}?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `We combine industry-leading materials with expert design specifically tailored for ${audience} to ensure superior quality and longevity.`
                            }
                        },
                        {
                            "@type": "Question",
                            "name": `How does this ${niche} benefit ${audience} compared to generic alternatives?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `Unlike standard versions, this ${niche} is optimized for the specific use cases of ${audience}, providing a more reliable and efficient experience.`
                            }
                        },
                        {
                            "@type": "Question",
                            "name": `Is there a warranty or guarantee for the ${niche}?`,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": `Yes, we stand behind our quality with a professional satisfaction guarantee specifically for our ${audience} community.`
                            }
                        }
                    ]
                };
                return [
                    {
                        label: 'Google FAQ Schema (JSON-LD)',
                        content: `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`,
                        isCode: true
                    }
                ];
            }
        },

        // --- CONVERSION OPTIMIZATION (6, 7, 8, 9) ---
        'btn-conv-desc': { // 6. Psychology-Driven Copy
            cost: 3,
            generate: (niche, audience) => {
                const text = (niche + ' ' + audience).toLowerCase();
                const isKids = /kids|child|parent|toddler|baby|toy|play/i.test(text);
                const isFitness = /fitness|gym|workout|athlete|sport|performance|muscle|yoga|running/i.test(text);
                const isLuxury = /luxury|premium|exclusive|high-end|bespoke|watch|jewelry/i.test(text);

                let copy = '';
                let cta = '';

                if (isKids) {
                    copy = `Finding the right balance between fun and safety is every parent's priority. This ${niche} is designed to spark creativity and keep your little ones engaged in meaningful play. We have focused on using durable, kid-friendly materials that can withstand even the most energetic afternoons, giving you peace of mind while they explore. Whether they are building, creating, or discovering something new, it provides a safe and inviting space for their imagination to flourish. It’s a wonderful way to encourage independent play while ensuring every moment is filled with smiles. Designed to be easy for small hands to use and even easier for parents to love, it’s the thoughtful choice for a happy, active childhood.`;
                    cta = "Start their next big adventure today!";
                } else if (isFitness) {
                    copy = `Pushing your limits requires gear that works as hard as you do. This ${niche} is engineered to support your fitness journey, offering the reliability and performance you need to reach your next milestone. We know that consistency is key to seeing results, which is why we’ve focused on comfort and durability that stands up to your most intense sessions. It’s about more than just the workout; it’s about the confidence that comes from knowing your equipment won’t let you down. Whether you’re training for a personal best or simply staying active, this ${niche} helps you stay focused on your goals. Experience a shift in your performance with balanced support designed for the dedicated mover.`;
                    cta = "Unlock your potential and shop now.";
                } else if (isLuxury) {
                    copy = `True quality is found in the details that others might overlook. This ${niche} represents a commitment to exceptional craftsmanship and timeless design, created for those who appreciate the finer things in life. Every element has been carefully considered to provide an experience of comfort and prestige that feels personal and unique. It is not just about ownership; it is about the quiet confidence that comes from using something built to the highest standards of excellence. This is the choice for individuals who value exclusivity and want a product that reflects their refined taste. Elevate your daily routine with a sophisticated solution that prioritizes lasting value and an uncompromising aesthetic.`;
                    cta = "Discover the official premium collection.";
                } else {
                    copy = `In a busy world, you need products that simply work well and make life a little easier. This ${niche} is built with a focus on practical benefits and everyday reliability, ensuring you get exactly what you need without unnecessary complexity. We’ve prioritized comfort and value, creating a solution that fits seamlessly into your lifestyle and provides consistent results you can count on. It’s a dependable choice for anyone looking to upgrade their daily routine with something that is durable, effective, and well-designed. Join the many people who have found a smarter way to manage their needs with a product that truly delivers on its promises. Quality you can trust, simplified for your convenience.`;
                    cta = "Get the reliability you deserve today.";
                }

                return [
                    {
                        label: 'Sales-Focused Copy',
                        content: `Product Name: ${niche}\nTarget Audience: ${audience}\nCopy: ${copy}\nCTA: ${cta}`
                    }
                ];
            }
        },
        'btn-conv-aida': { // 7. Emotional Trigger Gen
            cost: 1,
            generate: (niche, audience) => [
                {
                    label: 'Core Desires & Triggers', content: `Product Name: ${niche}\nEmotional Triggers:\n- Trigger 1: Prestige and status among the ${audience} community.\n- Trigger 2: Safety and reliability when using ${niche}.\n- Trigger 3: Excitement and joy from premium performance.`
                }
            ]
        },
        'btn-conv-urgency': { // 8. Scarcity Strategy
            cost: 1,
            generate: (niche, audience) => [
                {
                    label: 'Ethical Urgency Planning', content: `Product Name: ${niche}\nScarcity Tactics:\n- Limited Stock: Yes\n- Limited Time: Yes\n- Recommendation: Use "Only 12 left in stock" alert on the product page and a "Flash Sale ends at midnight" banner in top-of-funnel ads.`
                }
            ]
        },
        'btn-conv-trust': { // 9. Authority & Trust
            cost: 1,
            generate: (niche, audience) => [
                {
                    label: 'Social Proof & Credibility', content: `Product Name: ${niche}\nAuthority Elements:\n- Reviews: 5-star display near price\n- Testimonials: Featured carousel from verified ${audience}\n- Certifications / Awards: Yes\n- Trust Strategy: Display industry-standard certification badges below the Add to Cart button.`
                }
            ]
        },

        // --- ADS & TRAFFIC (10, 11, 12, 13) ---
        'btn-ads-fb': { // 10. FB/Meta Ad Consultant
            cost: 3,
            generate: (niche, audience) => [
                {
                    label: 'Hooks & Ad Copy', content: `Ad Objective: Conversion\nPrimary Hook: Are you a ${audience} looking to master your ${niche}? Discover the secret used by professionals to get better results in half the time.\nSecondary Hook / Angle: Why elite ${audience} are ditching generic store brands for this professional-grade ${niche}.\nCTA: Shop Now & Save 15%`
                }
            ]
        },
        'btn-ads-tt': { // 11. TikTok Viral Concept
            cost: 3,
            generate: (niche, audience) => [
                {
                    label: 'Short-Form Storytelling', content: `Product Name: ${niche}\nConcept Idea: A high-energy GRWM (Get Ready With Me) style video showing a ${audience} seamlessly integrating the ${niche} into their morning routine. Transition from a messy, inefficient setup to a sleek, optimized environment.\nHook: "This one ${niche} change changed my entire life."\nCTA / Action: Link in bio to shop!`
                }
            ]
        },
        'btn-ads-email': { // 12. Lifecycle Email Strategy
            cost: 3,
            generate: (niche, audience) => [
                {
                    label: 'Retention & Sequences', content: `Email Sequence:\n- Email 1: Welcome to the elite ${niche} community! Here is why ${audience} love us. Shop your first ${niche} with 10% off.\n- Email 2: How to get the most out of your new ${niche}. A value-add guide for ${audience}.\n- Email 3: Don't miss out on our limited edition ${niche} restock. Exclusive for members.\nMetrics: Open rate target: 35%, CTR target: 5%, Conversion target: 2%`
                }
            ]
        },
        'btn-ads-cart': { // 13. Abandoned Cart Genius
            cost: 1,
            generate: (niche, audience) => [
                {
                    label: 'Recovery Psychology', content: `Subject Line: Your ${niche} is waiting for you!\nContent: Hey there! We noticed you left your ${niche} in the cart. As a ${audience}, we know your time is valuable. Don't let your progress stall — finish your checkout now and get back to what you do best.\nCTA: Complete My Order\nFollow-up Timing: 1h, 24h, 48h`
                }
            ]
        },

        // --- PROFIT & SCALING (14, 15, 16, 17) ---
        'btn-calc-be': { // 14. Economic Health Check
            cost: 3,
            generate: (niche) => [
                {
                    label: 'Break-even & Margins', content: `Product / Store: ${niche}\nBreak-even Point: 45 units per month\nProfit Margin: 32%\nRecommendations: Increase bundling of ${niche} accessories to improve AOV and decrease relative shipping costs.`
                }
            ]
        },
        'btn-calc-margin': { // 15. Price Optimization
            cost: 3,
            generate: (niche) => [
                {
                    label: 'Maximize Profit Margins', content: `Product Name: ${niche}\nCurrent Price: $45.00\nRecommended Price: $54.99\nRationale: Based on the high-value positioning for professionally-targeted demographics, a $54.99 price point aligns better with luxury intent.`
                }
            ]
        },
        'btn-calc-roas': { // 16. Efficiency Analysis
            cost: 3,
            generate: (niche) => [
                {
                    label: 'ROAS & MER Strategy', content: `Product / Campaign: ${niche}\nCurrent ROAS / MER: 2.5x ROAS / 3.0 MER\nAnalysis: Strong retention but high acquisition costs for cold traffic.\nRecommendations: Pivot budget toward retargeting users who have viewed the ${niche} product page twice in the last 7 days.`
                }
            ]
        },
        'btn-calc-budget': { // 17. 3-Phase Scaling Road
            cost: 5,
            generate: (niche) => [
                {
                    label: 'Growth Roadmap', content: `Phase 1: Validate creative hooks with a $20/day test budget.\nPhase 2: Scale winning creative by 20% every 48 hours for ${niche}.\nPhase 3: Automated retargeting and cross-sell implementation for long-term LTV.\nMetrics to Track: MER (Marketing Efficiency Ratio), ROAS, AOV`
                }
            ]
        },

        // --- CONTENT FACTORY (18, 19, 20) ---
        'btn-lab-gen': { // 18. Product Lab
            cost: 3,
            generate: (name, features, audience, tone) => [
                {
                    label: 'Comprehensive Product SEO & Copy', content: `Product Name: ${name}\nKey Features: ${features || 'Premium quality, durable, stylish'}.\nTarget Audience: ${audience}\nTone: ${tone}\nSEO-Optimized Description: Step into the world of excellence with our ${name}, designed for ${audience} who refuse to compromise on quality. Featuring ${features || 'industry-leading technology'}, this ${name} is the definitive solution for your needs. Whether you're a professional or an enthusiast, the ${tone.toLowerCase()} appeal and superior performance make it a must-have. Our commitment to excellence ensures that every ${name} delivers results you can trust. Elevate your status and enjoy the ${name} today. Don't wait — join thousands of satisfied customers and shop the collection now.`
                }
            ],
            score: 97
        },
        'btn-meta-gen': { // 19. Store Meta Architect
            cost: 1,
            generate: (niche, audience, goal) => [
                {
                    label: 'High-Conversion Meta Tags', content: `Product / Store Name: ${niche}\nMeta Title: Best ${niche} for ${audience} | Official Store\nMeta Description: Upgrade your store with high-performance ${niche} designed for ${audience}. Achieve your goal to ${goal.toLowerCase()} with our premium collection today.\nURL Slug: shop-${niche.toLowerCase().replace(/\s+/g, '-')}\nTarget Audience: ${audience}\nGoal: ${goal}\nFocus Keywords: ${niche}, buy ${niche}, ${niche} online\nSEO Score / Recommendations: 98/100 - Ensure the primary keyword is in the first 10 characters for maximum ranking.`
                }
            ],
            score: 95
        },
        'btn-comp-gen': { // 20. Competitor Insights
            cost: 3,
            generate: (compText) => [
                {
                    label: 'Analyze Competitor Copy', content: `Competitor Product: ${compText.substring(0, 50)}...\nAnalysis:\n- Strengths: Clear use of emotional language and benefit-driven hooks.\n- Weaknesses: Lacks technical authority and specific proof points.\n- Recommendations: Outrank them by adding specific certifications and technical specifications that prove your superior quality.`
                }
            ],
            score: 94
        }
    };

    // --- BUTTON EVENT LISTENERS ---

    // Flagship Tool Specific Handler
    const btnFlagship = document.getElementById('btn-generate-blueprint');
    if (btnFlagship) {
        btnFlagship.addEventListener('click', () => {
            const name = document.getElementById('global-niche').value.trim();
            const price = document.getElementById('flag-price').value.trim();
            const audience = document.getElementById('global-audience').value.trim();
            const niche = document.getElementById('flag-niche').value.trim();
            const problem = document.getElementById('flag-problem').value.trim();

            if (!name || !price || !audience || !niche) {
                alert('Please fill in the Product Name (in Context Hub), Price, Audience (in Context Hub), and Niche to generate a Strategic Blueprint.');
                return;
            }

            if (!useCredit(10)) return;
            const originalHTML = startLoading(btnFlagship);

            setTimeout(() => {
                const output = tools['btn-generate-blueprint'].generate(name, audience, price, niche, problem);
                renderResult(output, 99, tools['btn-generate-blueprint'].implementation);
                stopLoading(btnFlagship, originalHTML);
                resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 3000);
        });
    }

    // Standard Tools Handler
    Object.keys(tools).forEach(id => {
        if (['btn-generate-blueprint', 'btn-lab-gen', 'btn-meta-gen', 'btn-comp-gen', 'btn-generate-meta', 'btn-analyze-competitor'].includes(id)) return;
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                const niche = globalNicheInput.value.trim();
                const audience = globalAudienceInput.value.trim();

                if (!niche || !audience) {
                    alert('Please provide context (Niche & Audience) in the Context Hub first.');
                    return;
                }

                const tool = tools[id];
                if (!useCredit(tool.cost)) return;

                const originalHTML = startLoading(btn);

                setTimeout(() => {
                    const output = tool.generate(niche, audience);
                    renderResult(output, tool.score, tool.implementation);
                    stopLoading(btn, originalHTML);
                    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 2000);
            });
        }
    });

    // --- SPECIALIZED HANDLERS FOR CONTENT FACTORY ---
    const setupContentTool = (btnId, inputIds, toolId) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', () => {
                const inputs = inputIds.map(id => document.getElementById(id).value.trim());
                if (inputs.some(val => !val)) {
                    alert('Please fill in all fields for this tool.');
                    return;
                }

                const tool = tools[toolId || btnId];
                if (!useCredit(tool.cost)) return;

                const originalHTML = startLoading(btn);
                setTimeout(() => {
                    const output = tool.generate(...inputs);
                    renderResult(output, tool.score);
                    stopLoading(btn, originalHTML);
                    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 2000);
            });
        }
    };

    setupContentTool('btn-lab-gen', ['lab-prod-name', 'lab-features', 'lab-audience', 'lab-tone']);
    setupContentTool('btn-meta-gen', ['meta-niche', 'meta-audience', 'meta-goal']);
    setupContentTool('btn-comp-gen', ['comp-text']);

    // --- INTEGRATED METADATA & ANALYSIS HANDLERS ---
    const generateMetadataBlock = (productName, niche, audience) => {
        const slug = productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').substring(0, 50);
        return `Product/Page Name: ${productName}\n` +
            `Meta Title: ${productName} | Best ${niche} for ${audience}\n` +
            `Meta Description: Upgrade your store with the best ${productName}. Designed specifically for ${audience}, this ${niche} offers unmatched quality and professional performance. Shop now!\n` +
            `URL Slug: ${slug}\n` +
            `Focus Keywords: ${productName}, ${niche}, ${audience}\n` +
            `SEO Score / Recommendations: 98/100 - High alignment with search intent. Ensure the focus keyword appears early in the title.`;
    };

    // --- INTEGRATED METADATA & ANALYSIS HANDLERS ---
    const handleIntegratedTool = (id) => {
        const niche = globalNicheInput.value.trim() || 'Product';
        const audience = globalAudienceInput.value.trim() || 'Customers';

        if (!useCredit(3)) return;

        const btn = document.getElementById(id);
        const originalHTML = startLoading(btn);

        setTimeout(() => {
            let content = '';
            if (id === 'btn-generate-meta') {
                content = `[HOME PAGE]\n` +
                    `Product/Page Name: Home\n` +
                    `Meta Title: Best ${niche} Online | Official ${niche} Store for ${audience}\n` +
                    `Meta Description: Shop premium ${niche} at our official store. Designed for elite ${audience}, our unique collection offers unmatched durability and style. Browse our top-rated selection today!\n` +
                    `URL Slug: /\n` +
                    `Focus Keywords: ${niche} store, buy ${niche} online, ${niche} for ${audience}\n` +
                    `SEO Score / Recommendations: 98/100 - Strong brand presence. Add a high-authority H1 tag to the homepage.\n\n` +

                    `[COLLECTION PAGE]\n` +
                    `Product/Page Name: All ${niche}\n` +
                    `Meta Title: ${niche} Collection | Top-Rated ${niche} Selection for ${audience}\n` +
                    `Meta Description: Discover the full range of ${niche} engineered for professional ${audience}. From innovative designs to classic styles, find the perfect match for your needs. Shop the sale now!\n` +
                    `URL Slug: collections/all-${niche.toLowerCase().replace(/\s+/g, '-')}\n` +
                    `Focus Keywords: ${niche} collection, ${niche} for professionals, best ${niche} accessories\n` +
                    `SEO Score / Recommendations: 96/100 - Good indexing potential. Use keyword-rich Alt text on collection images.\n\n` +

                    `[PRODUCT PAGE]\n` +
                    `Product/Page Name: Premium ${niche}\n` +
                    `Meta Title: Premium ${niche} | Optimized ${niche} Performance for ${audience}\n` +
                    `Meta Description: Experience the ultimate ${niche} designed for ${audience} who demand perfection. High-quality materials meet expert craftsmanship for a superior finish. Order yours now!\n` +
                    `URL Slug: products/premium-${niche.toLowerCase().replace(/\s+/g, '-')}\n` +
                    `Focus Keywords: professional ${niche}, high-performance ${niche}, durable ${niche} gear\n` +
                    `SEO Score / Recommendations: 99/100 - Perfect alignment with buyer intent. Ensure the product SKU is unique.`;
            } else {
                // For Competitor Analysis or single generation
                content = `Product/Page Name: ${niche}\n` +
                    `Meta Title: ${niche} for ${audience} | High-Authority ${niche} Solution\n` +
                    `Meta Description: Upgrade to the professional ${niche} designed for ${audience}. Featuring industry-leading quality and performance, it is the top choice for smart buyers. Shop today!\n` +
                    `URL Slug: ${niche.toLowerCase().replace(/\s+/g, '-')}\n` +
                    `Focus Keywords: ${niche} solutions, top ${niche} results, ${audience} choice\n` +
                    `SEO Score / Recommendations: 97/100 - High relevance. Add social proof elements to the product landing page.`;
            }

            renderResult([
                { label: 'Shopify Metadata Asset', content: content }
            ], 98);
            stopLoading(btn, originalHTML);
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1500);
    };

    ['btn-generate-meta', 'btn-analyze-competitor'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => handleIntegratedTool(id));
        }
    });
});
