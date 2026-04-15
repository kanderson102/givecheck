export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string;
  author: string;
  category: "Education" | "Comparison" | "Guide" | "Technical" | "Thought Leadership";
}

export const blogPosts: BlogPost[] = [
  {
    slug: "what-is-mrg",
    title: "What is Monthly Recurring Giving (MRG)?",
    description:
      "Define MRG, compare it to MRR, and understand why this new metric matters for founders who want to build generosity into their business model.",
    publishedAt: "2026-03-03",
    author: "GiveCheck Team",
    category: "Education",
    content: `
      <p>If you're a SaaS founder, you already live and die by MRR — Monthly Recurring Revenue. It's the heartbeat metric: predictable, measurable, and the single number investors ask about first. But what if there were an equally powerful metric for the giving side of your business?</p>

      <p>That's exactly what <strong>Monthly Recurring Giving (MRG)</strong> is. MRG measures the dollar amount a company donates to charitable causes on a recurring, monthly basis — verified through API connections rather than self-reported pledges.</p>

      <h2>MRG vs. MRR: A Natural Parallel</h2>

      <p>MRR tells you how much money flows into your business every month. MRG tells you how much flows out to causes you care about. The parallel is intentional. Just as MRR gives you predictability on the revenue side, MRG gives nonprofits predictability on the funding side. And just as MRR is the foundation for SaaS valuations, MRG can become the foundation for a company's social impact story.</p>

      <p>Here's a simple example: if your SaaS does $10,000/month in MRR and you donate $1,000/month to verified nonprofits, your MRG is $1,000 and your MRG percentage is 10%. That puts you in the 10% Club — the top tier of verified givers on GiveCheck.</p>

      <h2>Why MRG Matters for Founders</h2>

      <p>There are several reasons founders should care about tracking MRG:</p>

      <ul>
        <li><strong>Accountability:</strong> A vague promise to "give back" is easy to forget. A tracked MRG metric keeps you honest, just like tracking MRR keeps you focused on growth.</li>
        <li><strong>Consistency:</strong> One-time donations are great, but nonprofits need predictable funding to plan programs. Monthly giving is dramatically more valuable per dollar than sporadic contributions.</li>
        <li><strong>Storytelling:</strong> "We donate 10% of our revenue every month, verified by API" is a far more compelling narrative than "we care about social impact." MRG gives you a number to point to.</li>
        <li><strong>Competitive differentiation:</strong> In a crowded market, verified generosity sets you apart. Customers increasingly choose brands that align with their values.</li>
      </ul>

      <h2>How GiveCheck Calculates MRG</h2>

      <p>GiveCheck connects to your Stripe account via read-only OAuth to determine your monthly revenue. It then cross-references your donations through Every.org's API. The ratio between the two gives you your verified MRG percentage. No spreadsheets, no honor system — just automated, transparent verification.</p>

      <p>This is fundamentally different from programs that rely on self-reporting. When a company says "we pledge 1% of revenue," there's no mechanism to verify that claim. With MRG tracked through GiveCheck, every dollar is accounted for and publicly visible on the leaderboard.</p>

      <h2>The MRG Movement</h2>

      <p>We believe MRG will become as standard a metric as MRR for mission-driven companies. Just as the SaaS industry standardized around MRR, ARR, churn, and LTV, the next generation of founders will track MRG alongside their revenue metrics. It's not charity — it's a business practice. And like all good business practices, it works best when it's measured, verified, and public.</p>

      <p>If you're ready to start tracking your MRG, GiveCheck makes it effortless. Connect your Stripe, choose your nonprofits, and let the API do the rest. Your generosity becomes a number — and numbers don't lie.</p>
    `,
  },
  {
    slug: "from-mrr-to-mrg",
    title: "From MRR to MRG: Why Founders Should Track Giving Like Revenue",
    description:
      "The case for treating charitable giving as a systematic, measured metric — just like you already do with revenue.",
    publishedAt: "2026-03-05",
    author: "GiveCheck Team",
    category: "Thought Leadership",
    content: `
      <p>Every serious SaaS founder tracks MRR religiously. It's the first metric on your dashboard, the number you check before coffee, and the figure that determines whether you're having a good month or a bad one. MRR transformed how software companies think about revenue — from lumpy one-time sales to predictable, recurring streams.</p>

      <p>Now imagine applying that same rigor to giving.</p>

      <h2>The Problem with Ad-Hoc Giving</h2>

      <p>Most founders who care about social impact take an ad-hoc approach. They write a check at the end of the year, sponsor a local event, or donate when they feel flush. The problem? It's inconsistent, unmeasurable, and often the first thing cut when times get tight.</p>

      <p>This mirrors how software was sold before the SaaS model: unpredictable, lumpy, and hard to plan around. The SaaS revolution happened when founders realized that recurring revenue was fundamentally better than one-time sales — for them and for their customers. The same logic applies to giving.</p>

      <h2>What Changes When You Track MRG</h2>

      <p>When you commit to tracking Monthly Recurring Giving as a real metric, several things shift:</p>

      <ul>
        <li><strong>It becomes a line item, not an afterthought.</strong> MRG shows up in your monthly financial review right next to MRR, burn rate, and runway. It's a planned expense, not a guilt-driven impulse.</li>
        <li><strong>It scales with your business.</strong> A percentage-based MRG means your giving grows as your revenue grows. When you're at $5K MRR, you give $500/month at 10%. When you hit $50K MRR, you give $5,000/month. No manual adjustments needed.</li>
        <li><strong>It creates a public track record.</strong> Over time, your MRG history tells a story. Twelve months of verified 10% giving is a credential that no marketing budget can buy.</li>
        <li><strong>It makes giving competitive.</strong> When MRG is public and ranked, it creates positive social pressure. The GiveCheck leaderboard turns generosity into a status game — but one where everyone wins.</li>
      </ul>

      <h2>The Founder's MRG Stack</h2>

      <p>Here's what a practical MRG setup looks like for an indie founder:</p>

      <ol>
        <li><strong>Connect revenue tracking:</strong> Link your Stripe account to GiveCheck via read-only OAuth. This gives you an accurate, real-time MRR number.</li>
        <li><strong>Set your giving percentage:</strong> Start with what feels sustainable. Even 1% is a beginning. The 10% Club is the aspirational tier, but any verified percentage earns you a badge.</li>
        <li><strong>Choose your nonprofits:</strong> Use Every.org's directory of 1.2 million verified nonprofits, or pick a curated bucket fund if you don't want to choose.</li>
        <li><strong>Automate the donation:</strong> Set up monthly recurring donations that match your MRG target. GiveCheck verifies the percentage automatically.</li>
        <li><strong>Display and share:</strong> Embed your GiveCheck badge on your website. Share your leaderboard position. Make it part of your brand identity.</li>
      </ol>

      <h2>Why Now?</h2>

      <p>The cultural moment is right. Customers are more values-conscious than ever. The "build in public" movement has normalized transparency. And the tools finally exist to verify giving in real time, not just trust companies to self-report.</p>

      <p>MRR changed how we build companies. MRG can change how we give back while building them. The founders who adopt this metric early won't just be generous — they'll be leaders of a movement that redefines what success looks like in tech.</p>
    `,
  },
  {
    slug: "givecheck-vs-1-percent-for-the-planet",
    title: "GiveCheck vs 1% for the Planet: What's Different?",
    description:
      "A detailed comparison of GiveCheck and 1% for the Planet — covering verification methods, giving thresholds, target audiences, and reporting cadence.",
    publishedAt: "2026-03-08",
    author: "GiveCheck Team",
    category: "Comparison",
    content: `
      <p>1% for the Planet is one of the most recognized giving programs in the world. Founded in 2002 by Yvon Chouinard (Patagonia) and Craig Mathews, it has channeled over $635 million to environmental nonprofits. It's a fantastic organization with an impressive track record.</p>

      <p>GiveCheck is something different — built for a different era, a different audience, and a different philosophy. Here's an honest, detailed comparison.</p>

      <h2>Verification: API vs. Self-Reported</h2>

      <p>This is the biggest difference. <strong>1% for the Planet relies on self-reported annual giving data.</strong> Members submit their revenue figures and donation receipts once a year, and the organization reviews them. It's a trust-based system with periodic audits.</p>

      <p><strong>GiveCheck verifies giving in real time via API.</strong> Revenue is pulled directly from Stripe, and donations are verified through Every.org. There's no self-reporting step. The system knows your MRR and your donations at all times, and your badge reflects your current verified status. If you stop giving, your badge goes gray within days — not months.</p>

      <h2>Giving Threshold: 10% vs. 1%</h2>

      <p>1% for the Planet asks members to give 1% of annual sales. That's the floor and the ceiling — the program doesn't distinguish between a company giving 1% and one giving 15%.</p>

      <p>GiveCheck tracks the <em>actual percentage</em> each company gives, and ranks them on a public leaderboard. Any verified percentage earns you a badge, but the 10% Club is the aspirational tier. This creates a spectrum of giving rather than a binary pass/fail. A bootstrapped founder giving 12% of their $3K MRR gets recognized alongside (and often ranked above) a venture-backed startup giving 2%.</p>

      <h2>Target Audience: Indie Founders vs. Established Companies</h2>

      <p>1% for the Planet serves a broad range of businesses, from Patagonia to local coffee shops. Its $500+ annual membership fee and annual reporting structure are designed for established businesses with accounting teams.</p>

      <p>GiveCheck is built for <strong>SaaS founders, indie hackers, and solopreneurs</strong> — people who run their business through Stripe and want a lightweight, automated solution. There's no membership fee (the platform charges 0.29% of MRR, capped at $29/month, free under $1K MRR). Everything is self-serve and instant.</p>

      <h2>Reporting Cadence: Real-Time vs. Annual</h2>

      <p>1% for the Planet operates on an annual cycle. You commit at the beginning of the year and report at the end. This means there's a significant lag between the giving and the verification.</p>

      <p>GiveCheck operates in real time. Your MRG percentage updates monthly. Your leaderboard position adjusts. Your badge reflects your current status. This creates a tighter feedback loop that keeps founders engaged and accountable.</p>

      <h2>Cause Focus: Any Nonprofit vs. Environmental Only</h2>

      <p>1% for the Planet is focused specifically on environmental causes. Every approved nonprofit partner works on environmental issues. This is great if your mission aligns with environmental sustainability.</p>

      <p>GiveCheck is <strong>cause-agnostic.</strong> Through the Every.org integration, members can donate to any of 1.2 million verified 501(c)(3) nonprofits — environmental, educational, health-related, social justice, animal welfare, or anything else. Bucket funds offer curated bundles for founders who want diversified impact without choosing individual organizations.</p>

      <h2>Which Should You Choose?</h2>

      <p>They're not mutually exclusive. If you're an established company passionate about environmental causes and want the brand recognition of the 1% for the Planet logo, go for it. If you're an indie founder who wants automated, real-time verification and the flexibility to give more than 1% to any cause, GiveCheck is built for you.</p>

      <p>The real question isn't which program to join. It's whether you're measuring your giving at all. Both organizations agree on that fundamental point: intentional, tracked giving beats ad-hoc generosity every time.</p>
    `,
  },
  {
    slug: "givecheck-vs-pledge-1-percent",
    title: "GiveCheck vs Pledge 1%: Verified vs Honor System",
    description:
      "A comparison focusing on the credibility gap between API-verified giving and self-reported pledges.",
    publishedAt: "2026-03-10",
    author: "GiveCheck Team",
    category: "Comparison",
    content: `
      <p>Pledge 1% (now part of Percent Pledge) popularized a powerful idea: companies should commit 1% of their equity, profit, product, or employee time to social good. The Pledge 1% movement has attracted over 17,000 companies and raised awareness about corporate giving in the tech industry.</p>

      <p>But there's a structural problem that many founders have noticed: the "pledge" is exactly that — a pledge. An honor-system commitment with no built-in verification mechanism. Let's break down how GiveCheck approaches the same problem differently.</p>

      <h2>The Honor System Problem</h2>

      <p>When a company takes the Pledge 1% commitment, they sign a letter of intent. That's it. There's no automated check on whether the company follows through. There's no public dashboard showing their actual giving. And there's no consequence — beyond their own conscience — if they never donate a dollar.</p>

      <p>This isn't a criticism of Pledge 1%'s intentions. The movement has done enormous good by normalizing the idea of giving in tech. But the gap between pledging and giving is real. Studies suggest that a significant percentage of companies that take the pledge never formalize their giving programs. The intention is there; the infrastructure isn't.</p>

      <h2>How GiveCheck Closes the Gap</h2>

      <p>GiveCheck doesn't accept pledges. It verifies behavior. Here's the difference in practice:</p>

      <ul>
        <li><strong>Pledge 1%:</strong> Company signs a commitment. Joins a directory. May or may not follow through. No public accountability.</li>
        <li><strong>GiveCheck:</strong> Company connects Stripe (revenue) and donates through Every.org (giving). API verifies the percentage monthly. Badge updates in real time. Leaderboard ranks by actual giving percentage.</li>
      </ul>

      <p>This means a GiveCheck badge carries a fundamentally different kind of credibility. When a customer sees a GiveCheck badge on your website, they know the giving is happening right now — not that someone once signed a letter promising to give someday.</p>

      <h2>The 1% Floor vs. The Full Spectrum</h2>

      <p>Pledge 1% sets the bar at 1% — which, for many venture-backed companies with thin margins, is appropriate. But the model doesn't differentiate between a company giving exactly 1% and one giving 15%. Both get the same badge.</p>

      <p>GiveCheck tracks the actual percentage and creates a spectrum. The leaderboard is sorted by giving percentage, so a bootstrapped indie hacker giving 12% of their $5K MRR ranks above a Series B startup giving 2% of their $500K MRR. This is intentional: it's the percentage that matters, not the absolute amount. A great equalizer.</p>

      <h2>Equity Pledges: A Deferred Promise</h2>

      <p>One unique aspect of Pledge 1% is the equity pledge — promising 1% of company equity to charity. In theory, this is powerful: if the company has a successful exit, the nonprofit gets a windfall.</p>

      <p>In practice, equity pledges are deeply uncertain. Most startups fail. Of those that succeed, the equity pledge may be diluted, restructured, or forgotten during the chaos of an exit. It's a bet on a low-probability future event.</p>

      <p>GiveCheck focuses on <strong>giving that happens now.</strong> Monthly, verified, from actual revenue. This approach means nonprofits get predictable funding they can plan around, rather than a lottery ticket that might pay out in seven years — or never.</p>

      <h2>Can You Do Both?</h2>

      <p>Absolutely. Taking the Pledge 1% commitment as a statement of intent, then using GiveCheck to verify and track your actual giving, is a powerful combination. The pledge sets the intention; GiveCheck provides the accountability. Think of the pledge as the "why" and GiveCheck as the "proof."</p>

      <p>What matters most is that giving moves from aspiration to action. Whether you start with a pledge or a Stripe connection, the goal is the same: build a company that gives back, transparently and consistently.</p>
    `,
  },
  {
    slug: "givecheck-vs-b-corp",
    title: "GiveCheck vs B Corp Certification: A Lightweight Alternative",
    description:
      "B Corp certification is rigorous and comprehensive. GiveCheck is focused and fast. Here's how they differ in cost, complexity, and purpose.",
    publishedAt: "2026-03-12",
    author: "GiveCheck Team",
    category: "Comparison",
    content: `
      <p>B Corp certification is the gold standard of social impact credentials. Administered by B Lab, it evaluates a company across governance, workers, community, environment, and customers. Over 8,000 companies worldwide have earned the certification, including well-known brands like Allbirds, Ben & Jerry's, and Warby Parker.</p>

      <p>GiveCheck is not trying to replace B Corp. It's solving a different problem for a different audience. Let's compare.</p>

      <h2>Scope: Holistic vs. Focused</h2>

      <p>B Corp certification evaluates your <em>entire business.</em> The B Impact Assessment covers hundreds of questions about your supply chain, employee benefits, environmental practices, governance structure, and community engagement. It's a comprehensive audit of your company's social and environmental performance.</p>

      <p>GiveCheck focuses on <strong>one thing: verified charitable giving as a percentage of revenue.</strong> It doesn't evaluate your hiring practices, carbon footprint, or board structure. It answers a single question: "Does this company actually give what it claims to give?"</p>

      <p>This narrow focus is a feature, not a limitation. For indie founders and small SaaS companies, the full B Corp evaluation is overkill. You might not have a supply chain, a board of directors, or even employees. But you can absolutely commit to giving 10% of your revenue.</p>

      <h2>Cost and Time: Months vs. Minutes</h2>

      <p>The B Corp certification process typically takes <strong>12-18 months</strong> from start to finish. The assessment itself takes 40-80 hours to complete, and there's a verification period after submission. Annual fees range from $1,000 to $50,000+ based on company revenue.</p>

      <p>GiveCheck setup takes <strong>about five minutes.</strong> Connect your Stripe account, set up your donations through Every.org, and your badge is live. The platform fee is 0.29% of MRR, capped at $29/month, and completely free under $1K MRR.</p>

      <p>For a bootstrapped founder making $5K/month, a B Corp certification would cost thousands of dollars and months of time. GiveCheck costs $14.50/month and takes less time than ordering lunch.</p>

      <h2>Verification Model: Periodic Audit vs. Continuous API</h2>

      <p>B Corp requires recertification every three years. Between certifications, companies are trusted to maintain their standards. This is reasonable for comprehensive evaluations, but it means there's a lag between changes in behavior and changes in certification status.</p>

      <p>GiveCheck verification is <strong>continuous and automated.</strong> Your giving percentage is checked monthly against your actual Stripe revenue and Every.org donations. If you stop giving, your badge reflects that within days. There's no three-year grace period.</p>

      <h2>Who Is Each For?</h2>

      <p><strong>B Corp is ideal for:</strong> Established companies (typically $1M+ revenue) that want a comprehensive social impact credential. Companies with employees, supply chains, and physical operations. Businesses that can invest months and thousands of dollars in the certification process.</p>

      <p><strong>GiveCheck is ideal for:</strong> Solo founders, indie hackers, small SaaS teams, and bootstrapped companies. Anyone running a software business through Stripe who wants a verified, real-time giving credential without the overhead of a full certification process.</p>

      <h2>Complementary, Not Competitive</h2>

      <p>Many B Corps could also benefit from a GiveCheck badge. The B Corp certification tells customers "this company meets high standards across many dimensions." The GiveCheck badge tells them "this company verifiably donates X% of its revenue every month." They're complementary signals that together tell a powerful story.</p>

      <p>If you're a small founder who aspires to B Corp certification someday, GiveCheck is a great starting point. It builds the habit of systematic giving, creates a public track record, and demonstrates your commitment to impact — all without the overhead of a full certification. Think of it as the on-ramp to a giving-first business model.</p>
    `,
  },
  {
    slug: "givecheck-vs-giving-what-we-can",
    title: "GiveCheck vs Giving What We Can: Companies vs Individuals",
    description:
      "Giving What We Can focuses on personal giving pledges. GiveCheck focuses on company-level verified giving. Here's how they complement each other.",
    publishedAt: "2026-03-14",
    author: "GiveCheck Team",
    category: "Comparison",
    content: `
      <p>Giving What We Can (GWWC) is one of the most respected organizations in the effective altruism movement. Founded in 2009, it encourages individuals to pledge at least 10% of their income to the most effective charities. Over 9,000 people have taken the pledge, collectively committing billions of dollars to high-impact causes.</p>

      <p>GiveCheck operates in a different lane: it verifies charitable giving at the <strong>company level</strong>, specifically for SaaS founders and indie hackers. Let's explore the differences.</p>

      <h2>Individual vs. Company Giving</h2>

      <p>GWWC's pledge is personal. An individual commits 10% of their income — regardless of whether they're an employee, freelancer, or founder. The commitment follows the person, not their business.</p>

      <p>GiveCheck tracks giving at the company level. It connects to a company's Stripe account, measures revenue, and verifies donations as a percentage of that revenue. The commitment is tied to the business entity, not the individual founder. This matters for several reasons:</p>

      <ul>
        <li><strong>Tax efficiency:</strong> Corporate charitable donations are a deductible business expense. Personal donations come from after-tax income (though they're also deductible, the mechanics differ).</li>
        <li><strong>Brand value:</strong> A company badge on your website communicates values to customers. A personal pledge, while admirable, doesn't have the same commercial signaling power.</li>
        <li><strong>Scalability:</strong> As your company grows, company-level giving scales automatically. Personal income pledges require manual recalculation.</li>
      </ul>

      <h2>Effective Altruism vs. Cause-Agnostic</h2>

      <p>GWWC has deep roots in effective altruism (EA). The organization strongly encourages giving to the most cost-effective charities — those that save the most lives or reduce the most suffering per dollar. Their recommended charities are rigorously evaluated by organizations like GiveWell.</p>

      <p>GiveCheck is <strong>cause-agnostic.</strong> Through Every.org, members can donate to any of 1.2 million verified 501(c)(3) nonprofits. Whether you care about clean water, open-source software, local animal shelters, or cancer research, GiveCheck verifies your giving without judging the cause. This broader approach reflects the belief that consistent giving to causes you care about is better than no giving at all because you can't decide which charity is "most effective."</p>

      <h2>Pledge vs. Proof</h2>

      <p>GWWC's pledge is an honor-system commitment. Members sign a pledge and are encouraged to report their giving annually through a personal dashboard. There's no external verification — it relies on the integrity of the individual.</p>

      <p>GiveCheck verifies giving through API connections. There's no pledge to sign and no self-reporting. Either the money moved from your Stripe revenue to a verified nonprofit, or it didn't. The system is binary and objective.</p>

      <h2>Community and Culture</h2>

      <p>GWWC has built a remarkable community around the effective altruism ethos. Members connect through local groups, conferences, and online forums. The social aspect of the pledge — being part of a community of people committed to effective giving — is a powerful motivator.</p>

      <p>GiveCheck builds community through the <strong>public leaderboard.</strong> Rather than a community of shared philosophy, it's a community of shared action. The leaderboard creates friendly competition and social proof: when you see other founders giving 10-15% of their revenue, it normalizes that behavior and motivates you to do the same.</p>

      <h2>Can a Founder Do Both?</h2>

      <p>Absolutely — and many should. A founder could take the GWWC personal pledge (giving 10% of their salary) while also using GiveCheck to verify company-level giving (10% of business revenue). These are separate streams of generosity that compound beautifully.</p>

      <p>The personal pledge reflects your values as a human. The GiveCheck badge reflects your values as a business. Together, they tell a complete story of generosity that extends from your personal life into your professional identity.</p>
    `,
  },
  {
    slug: "how-to-start-giving-as-a-founder",
    title: "How to Start Giving as a Bootstrapped Founder",
    description:
      "A practical, step-by-step guide for bootstrapped founders who want to build charitable giving into their business from day one.",
    publishedAt: "2026-03-16",
    author: "GiveCheck Team",
    category: "Guide",
    content: `
      <p>You're bootstrapping a SaaS product. Revenue is growing but still modest. You care about giving back, but every dollar feels precious. You're not sure when the "right time" is to start donating, or how much makes sense. Sound familiar?</p>

      <p>Here's the truth: there's never a perfect time to start giving. But the earlier you build it into your business DNA, the easier it becomes. Here's a practical, no-guilt guide to getting started.</p>

      <h2>Step 1: Pick a Percentage, Not a Dollar Amount</h2>

      <p>The most common mistake founders make is picking a fixed dollar amount. "$100/month to charity" sounds reasonable — until your revenue doubles and that $100 becomes proportionally insignificant. Or until a bad month makes $100 feel like too much.</p>

      <p>Instead, <strong>commit to a percentage of revenue.</strong> This is the core principle behind MRG (Monthly Recurring Giving). Here's a framework:</p>

      <ul>
        <li><strong>1-2%:</strong> The starting point. Barely noticeable on your P&L, but it builds the habit.</li>
        <li><strong>3-5%:</strong> Meaningful giving that you can feel proud of. This is where most founders land initially.</li>
        <li><strong>7-10%:</strong> Serious commitment. The 10% Club tier on GiveCheck. This is where giving becomes a real part of your identity.</li>
        <li><strong>10%+:</strong> Exceptional. You're leading by example and inspiring others.</li>
      </ul>

      <p>Start wherever feels sustainable. You can always increase later. The goal is consistency, not heroism.</p>

      <h2>Step 2: Automate It</h2>

      <p>Willpower is a finite resource. If you have to manually write a check or make a donation every month, you'll skip months when you're busy, stressed, or forgetful. The solution is automation.</p>

      <p>Set up a recurring monthly donation through a platform like Every.org. Match it to your target percentage based on your current MRR. Review and adjust quarterly as your revenue changes. With GiveCheck, this becomes even simpler: the platform tracks your percentage automatically and alerts you if your giving falls below your target.</p>

      <h2>Step 3: Choose Your Nonprofits (or Don't)</h2>

      <p>Some founders have a specific cause they're passionate about. If that's you, find a verified 501(c)(3) that aligns with your values and set up your monthly donation.</p>

      <p>If you're overwhelmed by the choice (there are 1.2 million nonprofits in the US alone), consider a <strong>bucket fund.</strong> GiveCheck offers curated funds that distribute your donation across multiple high-impact organizations. It's like an index fund for giving — diversified, low-effort, and effective.</p>

      <h2>Step 4: Make It Public</h2>

      <p>This might feel uncomfortable, but it's important. Public giving creates accountability. When your customers, peers, and community can see that you give X% of your revenue, you're far less likely to stop during a rough month.</p>

      <p>Embed a GiveCheck badge on your website. Share your leaderboard position on social media. Mention your MRG in your email signature or on your pricing page. This isn't bragging — it's signaling your values and inspiring others to do the same.</p>

      <h2>Step 5: Don't Wait for "Enough" Revenue</h2>

      <p>The biggest trap is thinking "I'll start giving when I hit $10K MRR" or "once I'm profitable." These goalposts have a way of moving. And the habit of giving is much harder to build at $50K MRR if you never gave at $1K MRR.</p>

      <p>GiveCheck is free for companies under $1K MRR for exactly this reason. Start now, even if your MRG is $30/month. The amount matters less than the consistency. You're building a muscle — and muscles get stronger with regular exercise, not with waiting for the perfect gym.</p>

      <h2>Step 6: Track and Celebrate</h2>

      <p>At the end of each quarter, review your MRG metrics. How much did you give? What percentage of revenue was that? How does it compare to last quarter? Celebrate the progress, adjust the percentage if needed, and keep going.</p>

      <p>GiveCheck provides all of this data automatically through your dashboard. You can see your giving history, your leaderboard trajectory, and your cumulative impact over time. It turns giving from a vague good intention into a measurable business practice.</p>
    `,
  },
  {
    slug: "the-10-percent-club",
    title: "The 10% Club: What It Takes to Join",
    description:
      "The 10% Club is GiveCheck's top tier for companies giving 10% or more of gross revenue. Here's what it means, why it matters, and how it works.",
    publishedAt: "2026-03-18",
    author: "GiveCheck Team",
    category: "Education",
    content: `
      <p>On the GiveCheck leaderboard, you'll notice certain companies with an orange badge that says "10% Club." These are the companies giving 10% or more of their gross monthly revenue to verified nonprofits. It's the platform's highest tier of recognition — and it's harder to achieve than it sounds.</p>

      <h2>What 10% Actually Means</h2>

      <p>Let's do the math. If your SaaS makes $10,000/month in MRR, a 10% MRG commitment means $1,000/month going to charity. That's $12,000/year. For a bootstrapped founder, that's real money — possibly the difference between hiring a contractor and doing it yourself, or between a modest salary and a comfortable one.</p>

      <p>At $50,000/month MRR, the 10% Club means $5,000/month — $60,000/year in charitable giving. At $100,000/month, it's $10,000/month. The numbers get serious quickly, which is exactly the point. This isn't a token gesture; it's a meaningful commitment that demonstrates genuine values.</p>

      <h2>Why 10%?</h2>

      <p>The 10% threshold has deep cultural roots. Tithing — giving 10% of income to religious institutions — has been practiced across civilizations for millennia. Giving What We Can's pledge is 10% of personal income. There's something psychologically significant about the one-in-ten mark: it's substantial enough to feel meaningful, but not so large that it threatens business viability.</p>

      <p>For GiveCheck, 10% is aspirational but achievable. It's a number that makes people pause and think "can I really do that?" — and then feel genuinely proud when they do. It's also high enough that it can't happen by accident. You don't end up in the 10% Club without intentional, sustained commitment.</p>

      <h2>The Benefits of Membership</h2>

      <p>10% Club members on GiveCheck receive several distinct benefits:</p>

      <ul>
        <li><strong>The orange badge:</strong> A visually distinct badge that signals top-tier giving. This appears on your website widget, your leaderboard entry, and your GiveCheck profile.</li>
        <li><strong>Leaderboard prominence:</strong> 10% Club members are highlighted in search results and category rankings.</li>
        <li><strong>Social proof:</strong> Being in the 10% Club is a powerful signal to customers, partners, and potential hires. It says "this company puts its money where its mouth is."</li>
        <li><strong>Community:</strong> 10% Club members are part of an exclusive group of founders who've made exceptional commitments to giving. This creates networking opportunities with like-minded entrepreneurs.</li>
      </ul>

      <h2>How Verification Works</h2>

      <p>You can't self-declare your way into the 10% Club. GiveCheck verifies your membership through the same API-based system used for all members:</p>

      <ol>
        <li>Your Stripe account provides your verified MRR.</li>
        <li>Your Every.org donations provide your verified monthly giving.</li>
        <li>GiveCheck calculates the ratio on the 1st of each month.</li>
        <li>If your giving percentage is 10% or higher, you get the orange badge. If it drops below 10%, the badge reverts to the standard "Verified" badge.</li>
      </ol>

      <p>There's no lock-in period and no penalty for dropping out. Life happens — revenue dips, unexpected expenses arise. The 10% Club is a real-time status, not a lifetime achievement award. This keeps it honest and current.</p>

      <h2>Getting There</h2>

      <p>If you're currently giving 3-5% and want to reach 10%, consider a gradual increase. Bump your giving by 1-2 percentage points each quarter. At that pace, you'll reach 10% within a year without any single month feeling like a dramatic change. The key is to automate the increase so it happens without requiring a decision each time.</p>

      <p>The 10% Club isn't for everyone — and that's fine. Any verified giving is valuable, and the GiveCheck leaderboard celebrates all levels of commitment. But for founders who want to make generosity a defining feature of their company, the 10% Club is the goal to aim for.</p>
    `,
  },
  {
    slug: "api-verified-giving",
    title: "Why API-Verified Giving Matters More Than Pledges",
    description:
      "Self-reported pledges sound nice, but they don't change behavior. API-verified giving creates accountability, credibility, and real impact.",
    publishedAt: "2026-03-20",
    author: "GiveCheck Team",
    category: "Thought Leadership",
    content: `
      <p>In 2024, a study by the Indiana University Lilly Family School of Philanthropy found that corporate giving in the US totaled approximately $36 billion. But here's a less-reported figure: a significant portion of corporate giving "pledges" never materialize into actual donations. The gap between what companies promise and what they deliver is one of the biggest problems in corporate philanthropy.</p>

      <p>This is the pledge problem — and it's why API-verified giving represents a fundamental shift in how charitable commitments should work.</p>

      <h2>The Psychology of Pledges</h2>

      <p>When a founder signs a pledge to give a percentage of revenue to charity, something interesting happens psychologically: they feel good about themselves <em>immediately.</em> The act of committing triggers the same warm glow as the act of giving. Research in behavioral economics calls this "moral licensing" — having done something virtuous (making the pledge), people feel they've earned the right to relax their standards later.</p>

      <p>This isn't a character flaw. It's human nature. And it's exactly why pledge-based systems have lower follow-through rates than automated, verified systems. The pledge satisfies the emotional need without requiring the behavioral follow-through.</p>

      <h2>What "Verified" Actually Means</h2>

      <p>When GiveCheck says giving is "API-verified," here's what that means in practice:</p>

      <ul>
        <li><strong>Revenue verification:</strong> GiveCheck connects to your Stripe account via read-only OAuth. It can see your monthly revenue totals but cannot access individual customer data, modify charges, or take any action on your account. This provides an objective, tamper-proof revenue figure.</li>
        <li><strong>Donation verification:</strong> Donations routed through Every.org are tracked via their API. GiveCheck can confirm that a specific dollar amount was donated to verified 501(c)(3) organizations in a given month.</li>
        <li><strong>Percentage calculation:</strong> The ratio of verified donations to verified revenue gives the MRG percentage. This calculation happens automatically on the 1st of each month.</li>
        <li><strong>Real-time badge status:</strong> The JavaScript badge embedded on your website reflects your current verified status. It cannot be faked, cached, or manipulated — it's generated server-side based on the latest verification data.</li>
      </ul>

      <h2>Why This Matters for Credibility</h2>

      <p>Consider two scenarios from a customer's perspective:</p>

      <p><strong>Scenario A:</strong> A company's website says "We're proud members of [Pledge Program]. We've committed to donating 1% of our revenue to charity." There's a logo and a link to a directory where the company is listed.</p>

      <p><strong>Scenario B:</strong> A company's website has a dynamic badge showing "Verified: 12% MRG" with a link to their GiveCheck profile, showing monthly giving history, leaderboard position, and the specific nonprofits they support.</p>

      <p>Which is more credible? Which creates more trust? The answer is obvious — and it's the same reason financial audits exist. Claims require evidence, and the more transparent the evidence, the more credible the claim.</p>

      <h2>The Enforcement Mechanism</h2>

      <p>Perhaps the most important feature of API-verified giving is the enforcement mechanism: <strong>the badge goes gray.</strong> If a GiveCheck member stops donating, their badge stops displaying an active verification within days. It doesn't say "lapsed member" or display a warning — it simply stops showing the verified percentage.</p>

      <p>This is a powerful incentive. Once customers and peers have seen your verified badge, losing it is visible and embarrassing. It's the same principle that makes Yelp reviews effective — the threat of visible reputation damage drives better behavior than private feedback.</p>

      <h2>Moving the Industry Forward</h2>

      <p>We believe the future of corporate giving is verified, not pledged. Just as the organic food movement evolved from "trust us, it's organic" to rigorous third-party certification, corporate giving needs to evolve from pledges to proof. API-based verification makes this possible at scale, in real time, without adding administrative burden to the companies doing the giving.</p>

      <p>Pledges were a great starting point. They raised awareness and set intentions. But the next chapter of corporate giving needs to be built on data, not promises.</p>
    `,
  },
  {
    slug: "how-the-badge-works",
    title: "How the GiveCheck Badge Works (Technical Deep Dive)",
    description:
      "A technical walkthrough of the GiveCheck badge widget — from JavaScript embed to real-time verification and enforcement.",
    publishedAt: "2026-03-22",
    author: "GiveCheck Team",
    category: "Technical",
    content: `
      <p>The GiveCheck badge is the most visible element of the platform — a small widget that sits on your website and tells visitors exactly how much of your revenue goes to charity, verified in real time. But how does it actually work under the hood? This post is for the technically curious founders who want to understand the engineering before they embed.</p>

      <h2>The Embed Code</h2>

      <p>Adding the GiveCheck badge to your site is a single script tag:</p>

      <p><code>&lt;script src="https://badge.givecheck.org/v1/embed.js" data-company="your-slug"&gt;&lt;/script&gt;</code></p>

      <p>That's it. The script is lightweight (under 4KB gzipped) and loads asynchronously so it never blocks your page render. It creates a shadow DOM element to prevent style conflicts with your existing CSS.</p>

      <h2>What Happens When the Script Loads</h2>

      <p>Here's the sequence of events when a visitor loads a page with the GiveCheck badge:</p>

      <ol>
        <li><strong>Script initialization:</strong> The embed script reads the <code>data-company</code> attribute to identify which company's badge to render.</li>
        <li><strong>API call:</strong> The script makes a GET request to <code>https://api.givecheck.org/v1/badge/{slug}</code>. This endpoint returns a JSON payload with the company's current verification status, giving percentage, tier, and display configuration.</li>
        <li><strong>Rendering:</strong> Based on the API response, the script renders the appropriate badge variant inside a shadow DOM container. This includes the giving percentage, verification checkmark, and 10% Club indicator if applicable.</li>
        <li><strong>Caching:</strong> The badge data is cached in the visitor's browser for 15 minutes to reduce API calls. After the cache expires, the next page load triggers a fresh API call.</li>
      </ol>

      <h2>The Verification Pipeline</h2>

      <p>The badge displays data that's computed through a multi-step verification pipeline that runs on the 1st of each month:</p>

      <ol>
        <li><strong>Revenue pull:</strong> GiveCheck queries the Stripe API using the company's read-only OAuth token. It retrieves the total gross revenue for the previous calendar month. This uses Stripe's <code>balance_transactions</code> endpoint, filtered by type and date range.</li>
        <li><strong>Donation pull:</strong> GiveCheck queries Every.org's API to retrieve all donations made by the company during the same month. This includes the amount, recipient nonprofit, and transaction status.</li>
        <li><strong>Calculation:</strong> The system divides total verified donations by total verified revenue to get the MRG percentage. Both numbers are stored for audit purposes.</li>
        <li><strong>Status update:</strong> The company's badge status is updated in the database. If the percentage is 10% or higher, the 10% Club flag is set. If giving has dropped to zero, the badge enters a grace period (typically one month) before going gray.</li>
      </ol>

      <h2>The Gray Badge: Enforcement</h2>

      <p>The enforcement mechanism is simple but effective. If a company's verified giving drops to 0% for two consecutive months, their badge transitions to a gray state. The gray badge doesn't show a percentage — it shows "Verification Lapsed." This is visible to anyone who visits the company's website.</p>

      <p>The gray badge can't be hidden or removed through the API — it's a deliberate design choice. If you embed the GiveCheck badge, you're opting into public accountability. You can always remove the script tag from your site, but as long as it's there, it tells the truth.</p>

      <h2>Security Considerations</h2>

      <p>Several security measures protect the badge system:</p>

      <ul>
        <li><strong>Read-only Stripe access:</strong> GiveCheck's OAuth scope is limited to reading balance transactions and account information. It cannot create charges, modify customers, or access sensitive payment data.</li>
        <li><strong>Server-side rendering:</strong> The badge data is computed server-side. The JavaScript embed is a display layer only — it cannot modify verification data.</li>
        <li><strong>Rate limiting:</strong> The badge API is rate-limited per IP and per company slug to prevent abuse.</li>
        <li><strong>CORS restrictions:</strong> The badge API only responds to requests from domains that the company has registered in their GiveCheck settings.</li>
        <li><strong>No PII exposure:</strong> The badge API never returns customer data, transaction details, or any personally identifiable information. It returns only the company name, giving percentage, tier, and verification timestamp.</li>
      </ul>

      <h2>Customization Options</h2>

      <p>The badge supports several display options via data attributes: <code>data-theme</code> (light or dark), <code>data-size</code> (small, medium, large), and <code>data-style</code> (badge, banner, minimal). These let you match the widget to your site's design without writing any CSS.</p>

      <p>For advanced users, the raw API endpoint is available for building custom badge implementations. As long as you're displaying accurate, current data from the API, you're free to design the display however you'd like.</p>
    `,
  },
  {
    slug: "public-giving-leaderboards",
    title: "The Case for Public Giving Leaderboards",
    description:
      "Why transparency in charitable giving drives more action than private virtue — and how public leaderboards create a positive-sum status game.",
    publishedAt: "2026-03-24",
    author: "GiveCheck Team",
    category: "Thought Leadership",
    content: `
      <p>There's a long-standing cultural norm that charity should be quiet. "Don't let your left hand know what your right hand is doing." Humility in giving is considered a virtue, and public displays of generosity are sometimes viewed with suspicion — as ego-driven or performative.</p>

      <p>We respectfully disagree. And the data backs us up.</p>

      <h2>The Research on Public Giving</h2>

      <p>A 2017 study published in the Journal of Economic Behavior and Organization found that making donations public increased average giving by 12%. A separate study by the National Bureau of Economic Research showed that social information — knowing what peers are giving — is one of the strongest predictors of charitable behavior.</p>

      <p>This makes intuitive sense. Humans are social creatures. We calibrate our behavior based on what we see others doing. When giving is private, there's no signal to calibrate against. When it's public, it creates a reference point: "If they're giving 10%, maybe I should consider doing the same."</p>

      <h2>The Positive-Sum Status Game</h2>

      <p>Tech culture loves status games. GitHub contribution graphs, Twitter follower counts, Product Hunt launches, revenue milestones — founders constantly signal status through public metrics. These games are zero-sum or even negative-sum: your gain is often someone else's loss, or the game incentivizes vanity metrics over real value.</p>

      <p>A giving leaderboard is different. <strong>It's a status game where everyone wins.</strong> When a founder climbs the GiveCheck leaderboard by increasing their giving percentage, the "losers" are... no one. Nonprofits receive more funding. The founder gets recognition. Customers get to support a values-aligned business. The industry shifts toward greater generosity. There's no downside.</p>

      <h2>Why Rankings Matter</h2>

      <p>GiveCheck ranks companies by giving percentage rather than absolute dollar amount. This is an intentional design choice with important implications:</p>

      <ul>
        <li><strong>It's equalizing.</strong> A solo founder giving 15% of $3K MRR ranks above a funded startup giving 2% of $200K MRR. Commitment matters more than scale.</li>
        <li><strong>It incentivizes the right behavior.</strong> Ranking by absolute dollars would favor large companies and discourage small ones. Ranking by percentage means anyone can compete.</li>
        <li><strong>It's harder to game.</strong> You can't inflate your percentage without actually giving more relative to your revenue. The Stripe integration ensures the revenue figure is accurate.</li>
      </ul>

      <h2>Addressing the "Performative" Criticism</h2>

      <p>Some people argue that public giving is performative — that people are giving for the social approval rather than genuine altruism. This criticism misses the point entirely.</p>

      <p>If a founder donates $1,000/month to a children's hospital because they want to be #1 on a leaderboard, <strong>the children still benefit.</strong> The motivation behind the donation doesn't change the impact of the donation. And research consistently shows that the "performative" criticism is mostly theoretical — in practice, public giving programs increase total giving without crowding out private giving.</p>

      <p>Moreover, habits that start as extrinsically motivated often become intrinsically motivated over time. A founder who starts giving for leaderboard status may continue giving because they've seen the impact firsthand and it's become part of their identity.</p>

      <h2>The Network Effect of Transparency</h2>

      <p>Public leaderboards create a network effect. Each company that joins makes the leaderboard more valuable for every other company. More participants mean more visibility, more social proof, and more competitive pressure to give generously.</p>

      <p>Early participants benefit most — they set the standard and establish leaderboard positions while competition is low. But even late joiners benefit from the established norm of giving that the leaderboard creates.</p>

      <p>The end goal isn't a leaderboard with 100 companies. It's a world where tracking and publishing your MRG is as standard as publishing your uptime SLA. Public giving leaderboards are the mechanism that gets us there — not through guilt, but through positive social incentives and the very human desire to be seen doing good.</p>
    `,
  },
  {
    slug: "stripe-connect-integration",
    title: "How GiveCheck Uses Stripe Connect (Read-Only)",
    description:
      "A technical explanation for founders concerned about connecting their Stripe account — what GiveCheck can and cannot access.",
    publishedAt: "2026-03-26",
    author: "GiveCheck Team",
    category: "Technical",
    content: `
      <p>The most common question founders ask before joining GiveCheck is: "You want me to connect my Stripe account? What exactly can you see?" It's a fair question, and we believe in radical transparency about our Stripe integration. Here's exactly how it works.</p>

      <h2>OAuth, Not API Keys</h2>

      <p>GiveCheck uses <strong>Stripe Connect with OAuth</strong> — the same secure authorization flow used by platforms like Shopify, Zapier, and thousands of other SaaS tools that integrate with Stripe. You never share your API keys with GiveCheck. Instead, you go through Stripe's official OAuth flow, which grants GiveCheck a scoped access token.</p>

      <p>This is the same process you'd use to connect any authorized third-party application. Stripe controls the authorization, handles the token exchange, and enforces the permission scopes. GiveCheck doesn't build or maintain its own Stripe credential system.</p>

      <h2>What GiveCheck Can See</h2>

      <p>The OAuth scope GiveCheck requests is deliberately minimal. Here's exactly what the integration can access:</p>

      <ul>
        <li><strong>Balance transactions:</strong> GiveCheck can read your balance transaction history — the aggregate inflows to your Stripe account. This is used to calculate your monthly gross revenue figure.</li>
        <li><strong>Account information:</strong> Basic account details like your business name and currency, used for display purposes on the leaderboard and badge.</li>
      </ul>

      <p>That's it. Two endpoints. Balance transactions and account info.</p>

      <h2>What GiveCheck Cannot See or Do</h2>

      <p>Here's the list of things GiveCheck's Stripe integration explicitly <strong>cannot</strong> do:</p>

      <ul>
        <li><strong>Cannot see individual customers:</strong> GiveCheck has no access to your customer list, their email addresses, payment methods, or subscription details.</li>
        <li><strong>Cannot see individual charges:</strong> The integration reads aggregate balance transactions, not individual payment records.</li>
        <li><strong>Cannot create charges:</strong> GiveCheck cannot charge your customers, create invoices, or initiate any payment on your behalf.</li>
        <li><strong>Cannot modify your account:</strong> No changes to your Stripe settings, payout schedule, or account configuration.</li>
        <li><strong>Cannot access Stripe Dashboard:</strong> The OAuth token doesn't grant dashboard access. GiveCheck's access is purely API-based and automated.</li>
        <li><strong>Cannot transfer funds:</strong> GiveCheck cannot move money out of your Stripe account or initiate payouts.</li>
      </ul>

      <h2>How Revenue Is Calculated</h2>

      <p>Each month, GiveCheck's verification system queries your Stripe balance transactions for the previous calendar month. It sums the gross amount of all successful transactions, excluding refunds, disputes, and Stripe fees. This gives us your gross monthly revenue — the denominator in your MRG percentage calculation.</p>

      <p>The calculation runs automatically on the 1st of each month. The result is stored as a single number (gross revenue in cents) and a timestamp. No transaction-level data is stored in GiveCheck's database.</p>

      <h2>Data Storage and Security</h2>

      <p>GiveCheck stores the following Stripe-related data:</p>

      <ul>
        <li>Your Stripe account ID (used to identify the connection)</li>
        <li>The OAuth access token (encrypted at rest, used for API calls)</li>
        <li>Monthly revenue totals (a single number per month)</li>
        <li>Your business name and currency</li>
      </ul>

      <p>All data is encrypted at rest and in transit. OAuth tokens are stored in a separate, encrypted secrets store with access logging. GiveCheck's infrastructure runs on secure cloud providers with SOC 2-compliant hosting.</p>

      <h2>Revoking Access</h2>

      <p>You can revoke GiveCheck's access at any time through your Stripe Dashboard under Settings > Authorized Applications. Revoking access immediately invalidates the OAuth token, and GiveCheck can no longer query your account. Your badge will transition to a gray "Verification Lapsed" state within the next verification cycle.</p>

      <p>You can also disconnect from within GiveCheck's dashboard, which triggers the same revocation process. There are no cancellation fees, lock-in periods, or penalties for disconnecting.</p>

      <p>We built the Stripe integration to be as minimal and transparent as possible because trust is the foundation of what we do. If you have questions about the technical implementation that aren't covered here, reach out to our team — we're happy to walk through the details.</p>
    `,
  },
  {
    slug: "every-org-integration",
    title: "Every.org Integration: 1.2M Nonprofits at Your Fingertips",
    description:
      "How GiveCheck integrates with Every.org to give founders access to 1.2 million verified nonprofits and a seamless donation pipeline.",
    publishedAt: "2026-03-28",
    author: "GiveCheck Team",
    category: "Technical",
    content: `
      <p>When we built GiveCheck, we faced a fundamental question: should we build our own donation infrastructure, or partner with someone who's already solved the problem? The answer was obvious. Every.org has built the best nonprofit donation platform on the internet, and their API makes it possible for GiveCheck to offer founders access to 1.2 million verified 501(c)(3) organizations without reinventing the wheel.</p>

      <h2>What Is Every.org?</h2>

      <p>Every.org is a nonprofit platform that makes it easy to donate to any US 501(c)(3) organization. They handle payment processing, tax receipts, and nonprofit verification. Think of them as the Stripe of charitable giving — a clean, developer-friendly infrastructure layer that handles the complexity of nonprofit donations.</p>

      <p>Their database includes over 1.2 million verified nonprofits, from global organizations like the Red Cross and Doctors Without Borders to local animal shelters and community food banks. If it's a registered 501(c)(3), it's probably on Every.org.</p>

      <h2>How the Integration Works</h2>

      <p>Here's the donation pipeline from a GiveCheck member's perspective:</p>

      <ol>
        <li><strong>Search and select:</strong> Within your GiveCheck dashboard, you search for nonprofits using Every.org's API. You can search by name, cause area, location, or EIN (Employer Identification Number).</li>
        <li><strong>Set up recurring donation:</strong> You choose your monthly donation amount and recipient(s). You can split your donation across multiple nonprofits or direct it all to one.</li>
        <li><strong>Payment processing:</strong> The donation is processed through Every.org's payment infrastructure. You can pay via credit card, bank transfer, or even cryptocurrency. Every.org handles the money movement and compliance.</li>
        <li><strong>Tax receipt:</strong> Every.org issues a tax-deductible receipt for each donation. Since Every.org is itself a 501(c)(3) that acts as a fiscal sponsor, your donation is fully tax-deductible regardless of which underlying nonprofit you choose.</li>
        <li><strong>Verification:</strong> GiveCheck's API queries Every.org to confirm the donation amount, date, and recipient. This data feeds into your MRG calculation.</li>
      </ol>

      <h2>Bucket Funds: Curated Giving Made Easy</h2>

      <p>Not every founder wants to research individual nonprofits. That's why GiveCheck offers <strong>bucket funds</strong> — curated bundles of nonprofits organized by theme. Examples include:</p>

      <ul>
        <li><strong>Open Source Fund:</strong> Supporting organizations that maintain critical open-source infrastructure.</li>
        <li><strong>Climate Action Fund:</strong> A diversified portfolio of climate and environmental nonprofits.</li>
        <li><strong>Education Access Fund:</strong> Organizations focused on education equity and access globally.</li>
        <li><strong>Global Health Fund:</strong> High-impact health organizations recommended by evidence-based evaluators.</li>
      </ul>

      <p>When you donate to a bucket fund, your contribution is distributed across all nonprofits in the fund according to a preset allocation. It's the index fund approach to giving: diversified, low-effort, and effective.</p>

      <h2>Why Every.org and Not Direct Donations?</h2>

      <p>There are several reasons we route donations through Every.org rather than directly to nonprofits:</p>

      <ul>
        <li><strong>Verification:</strong> Every.org's API allows us to confirm donations programmatically. Direct donations to individual nonprofits would require manual verification — defeating the purpose of an automated system.</li>
        <li><strong>Tax compliance:</strong> Every.org handles tax receipt generation and compliance. This removes a significant administrative burden from both GiveCheck and the donor.</li>
        <li><strong>Nonprofit coverage:</strong> With 1.2 million nonprofits in their database, Every.org covers essentially every registered charity in the US. No single integration point gives founders more choice.</li>
        <li><strong>Payment flexibility:</strong> Every.org supports multiple payment methods and handles the complexity of disbursing funds to nonprofits of all sizes and technical capabilities.</li>
      </ul>

      <h2>Data Privacy</h2>

      <p>GiveCheck receives only the data needed for verification from Every.org: donation amounts, dates, and recipient nonprofit IDs. We do not store payment method details, and we do not have access to your Every.org account credentials. The integration uses API tokens with read-only scope, similar to our Stripe integration.</p>

      <p>For founders who already donate through Every.org independently, GiveCheck can recognize those existing donations in your MRG calculation — no need to change your giving setup. Just authorize the API connection, and your existing giving history feeds into your verified percentage.</p>
    `,
  },
  {
    slug: "tax-deductions-for-startups",
    title: "Tax Deductions for Startup Charitable Giving",
    description:
      "Practical tax guidance for founders: how charitable donations work as business deductions, and what you need to know about structures and limits.",
    publishedAt: "2026-03-30",
    author: "GiveCheck Team",
    category: "Guide",
    content: `
      <p><em>Disclaimer: This article provides general information about tax deductions for charitable giving. It is not tax advice. Consult a qualified tax professional for guidance specific to your situation.</em></p>

      <p>One of the most common questions founders ask about starting a giving program is: "Can I deduct this?" The short answer is usually yes — but the details depend on your business structure, the type of donation, and how you set things up.</p>

      <h2>Business Structure Matters</h2>

      <p>How your charitable donations are treated for tax purposes depends heavily on your business entity type:</p>

      <p><strong>Sole Proprietorship / Single-Member LLC:</strong> There's no separate "business" deduction for charitable giving. Your donations are deducted on your personal return (Schedule A) as itemized deductions. The business doesn't claim the deduction — you do. This means you need to itemize rather than take the standard deduction to benefit.</p>

      <p><strong>S Corporation:</strong> Similar to sole props — charitable deductions pass through to shareholders' personal returns. However, the S Corp can make the donation as a corporate entity, and the deduction flows through on Schedule K-1.</p>

      <p><strong>C Corporation:</strong> The corporation itself can deduct charitable contributions up to 10% of its taxable income. This is the most straightforward structure for company-level giving programs, as the deduction happens at the corporate level.</p>

      <p><strong>Partnership / Multi-Member LLC:</strong> Charitable deductions pass through to individual partners based on their ownership percentage.</p>

      <h2>The 501(c)(3) Requirement</h2>

      <p>For a donation to be tax-deductible, the recipient must be a qualified 501(c)(3) organization. This is why GiveCheck routes all donations through Every.org — every nonprofit in their database is a verified 501(c)(3), and Every.org itself is a 501(c)(3) that acts as a fiscal intermediary.</p>

      <p>When you donate through GiveCheck/Every.org, you receive a tax receipt for each donation that includes:</p>

      <ul>
        <li>The amount donated</li>
        <li>The date of the donation</li>
        <li>The recipient organization's name and EIN</li>
        <li>A statement that no goods or services were received in exchange</li>
      </ul>

      <p>This receipt is all you need for tax documentation purposes (for donations under $250, a bank statement is technically sufficient, but having the receipt is always better practice).</p>

      <h2>Deduction Limits</h2>

      <p>There are limits on how much you can deduct:</p>

      <ul>
        <li><strong>Individuals:</strong> Cash donations to public charities are deductible up to 60% of your adjusted gross income (AGI). Donations exceeding this limit can be carried forward for up to five years.</li>
        <li><strong>C Corporations:</strong> The limit is 10% of taxable income, with a five-year carryforward for excess contributions.</li>
      </ul>

      <p>For most founders using GiveCheck with a 10% MRG, you're unlikely to hit these limits. A founder earning $100K and giving 10% of their $50K MRR ($5K/month, $60K/year) is well within the 60% AGI limit.</p>

      <h2>Timing Considerations</h2>

      <p>Donations are deductible in the year they're made, not the year they're pledged. This is another advantage of the MRG model — monthly recurring donations are deductible in the month they occur, giving you predictable tax treatment throughout the year rather than a lump sum in December.</p>

      <h2>Record Keeping</h2>

      <p>Good record keeping is essential. For your giving program, maintain:</p>

      <ul>
        <li>Tax receipts from Every.org for each donation</li>
        <li>Bank or credit card statements showing the transactions</li>
        <li>A log of your monthly MRG calculations (GiveCheck provides this automatically)</li>
        <li>Any correspondence with your tax advisor about the giving program</li>
      </ul>

      <p>GiveCheck's dashboard provides a downloadable annual giving summary that includes all of this information, formatted for easy handoff to your accountant or tax preparer.</p>

      <h2>The Net Cost of Giving</h2>

      <p>Here's the part that surprises many founders: the after-tax cost of giving is less than the gross amount. If you're in the 32% federal tax bracket (income between $191K and $243K for 2026), a $1,000 donation costs you approximately $680 after the tax deduction. Add state tax benefits, and the net cost drops further.</p>

      <p>This doesn't make giving "free" — but it means the financial impact is smaller than it appears. A 10% MRG commitment effectively costs closer to 6.5-7% of revenue after tax benefits, depending on your bracket. That's a much easier number to commit to.</p>
    `,
  },
  {
    slug: "generosity-competitive-advantage",
    title: "Making Generosity a Competitive Advantage",
    description:
      "How verified charitable giving builds brand equity, attracts talent, wins customers, and creates a moat that competitors can't easily replicate.",
    publishedAt: "2026-04-01",
    author: "GiveCheck Team",
    category: "Thought Leadership",
    content: `
      <p>In a market where every SaaS product has similar features, comparable pricing, and professional marketing, how do you stand out? The traditional answers — better design, faster support, more features — are temporary advantages that competitors can copy. But there's one differentiator that's extremely difficult to replicate: <strong>a genuine, verified commitment to giving back.</strong></p>

      <h2>The Consumer Preference Shift</h2>

      <p>The data on consumer preferences is clear and directional. A 2023 Edelman Trust Barometer study found that 63% of consumers buy or advocate for brands based on their values. A Cone Communications study found that 87% of consumers would purchase a product because a company advocated for an issue they cared about. And crucially, younger consumers — the emerging majority of purchasing power — weight values even more heavily in their buying decisions.</p>

      <p>For B2B SaaS, the dynamic is similar. Procurement teams increasingly evaluate vendors on social responsibility criteria. When two tools have comparable features and pricing, the one with a verified giving program wins the tiebreaker.</p>

      <h2>Brand Equity You Can't Buy</h2>

      <p>Marketing budgets can buy awareness, but they can't buy authenticity. A GiveCheck badge that says "Verified: 12% MRG" communicates something that no ad campaign can replicate: this company puts real money behind its values, and there's a public, verifiable record to prove it.</p>

      <p>Consider the brand halo effect. When a customer sees that you give 12% of your revenue to charity, it colors their perception of everything else about your company. Your customer support feels more genuine. Your pricing feels fairer. Your product feels more trustworthy. This halo extends beyond the giving itself — it creates a narrative about who you are as a company.</p>

      <h2>Talent Attraction</h2>

      <p>The talent market for software engineers and product people is fiercely competitive. Salary and equity are table stakes. What increasingly differentiates employers is mission and values. A company with a verified, public giving program signals to potential hires that it cares about more than profit maximization.</p>

      <p>This is especially powerful for indie founders and small teams. You probably can't compete with Big Tech on compensation. But you can offer something they can't: the chance to work at a company where generosity is a measurable, public priority. For values-aligned candidates, that's worth more than a few extra thousand dollars in salary.</p>

      <h2>The Moat of Consistency</h2>

      <p>Here's where the competitive advantage becomes durable: consistency is hard to fake. A competitor can slap a "we donate to charity" badge on their website tomorrow. But they can't instantly create a 12-month track record of verified 10% MRG, a top-20 leaderboard position, and a community reputation built on sustained giving.</p>

      <p>Every month you maintain your MRG commitment, you're building a deeper moat. Your giving history becomes a credential that takes time to earn. It's like a GitHub contribution history for generosity — you can see the consistency, and you can't backdate it.</p>

      <h2>Customer Retention</h2>

      <p>Giving programs don't just acquire customers — they retain them. When a customer knows that their subscription fee includes a verified donation to charity, switching to a competitor has a moral cost. It's not just about losing features; it's about withdrawing support from causes they care about.</p>

      <p>This creates a form of emotional lock-in that's entirely positive. The customer isn't trapped — they're choosing to stay because the relationship aligns with their values. This is the healthiest form of retention: voluntary loyalty driven by shared purpose.</p>

      <h2>Practical Steps</h2>

      <p>To turn generosity into a competitive advantage, you need to make it visible and verifiable:</p>

      <ol>
        <li><strong>Embed the badge:</strong> Put your GiveCheck badge on your homepage, pricing page, and footer. Make it impossible to miss.</li>
        <li><strong>Mention it in sales conversations:</strong> "By the way, we give 10% of our revenue to verified nonprofits. Here's our GiveCheck profile." This is a differentiation point, not a sales trick.</li>
        <li><strong>Include it in hiring:</strong> Add your giving commitment to job postings and the careers page. Values-aligned candidates will self-select in.</li>
        <li><strong>Share milestones:</strong> When you cross giving milestones — $10K total, 12 months consecutive, top 10 on the leaderboard — share them publicly. These are achievements worth celebrating.</li>
      </ol>

      <p>Generosity isn't just good ethics. In a world that's starving for authenticity, it's good business.</p>
    `,
  },
  {
    slug: "indie-hackers-charitable-giving",
    title: "Why Indie Hackers Should Care About Charitable Giving",
    description:
      "Charitable giving isn't just for big companies. Here's why the indie hacker community is uniquely positioned to lead a new wave of tech generosity.",
    publishedAt: "2026-04-02",
    author: "GiveCheck Team",
    category: "Education",
    content: `
      <p>The indie hacker ethos is built on independence, transparency, and doing things differently. Indie hackers build in public, share revenue numbers openly, and reject the venture-capital playbook of growth-at-all-costs. So why isn't charitable giving part of the indie hacker identity — yet?</p>

      <p>We think it should be, and here's why the indie hacker community is uniquely positioned to lead a new movement in tech generosity.</p>

      <h2>You Already Have the Infrastructure</h2>

      <p>Here's what makes indie hackers different from traditional businesses when it comes to setting up a giving program: you already have everything you need. You run your business through Stripe. Your revenue is real-time and measurable. You're comfortable with APIs, automation, and public metrics.</p>

      <p>Setting up an MRG program through GiveCheck takes five minutes for an indie hacker, compared to the weeks or months it might take a traditional company to get legal approval, set up a corporate giving program, and align their accounting. The tools are already in your stack.</p>

      <h2>You're Already Building in Public</h2>

      <p>The "build in public" movement has normalized sharing revenue numbers, growth metrics, and business decisions with the world. Indie hackers post their MRR on Twitter, write monthly revenue reports, and maintain public dashboards. This transparency culture is exactly the foundation that MRG needs.</p>

      <p>Adding your giving percentage to your public metrics is a natural extension of building in public. "This month: $8K MRR, 47 new customers, $800 MRG (10%)." It fits right into the existing format and extends the narrative from "look how I'm growing" to "look how I'm growing and giving back."</p>

      <h2>The Marginal Dollar Is More Meaningful</h2>

      <p>When a Fortune 500 company donates $1 million, it's a rounding error on their balance sheet. When an indie hacker making $5K/month donates $500, it's a genuine sacrifice that reflects genuine values. The marginal utility of each dollar is higher when you have fewer of them, which means indie hacker giving is proportionally more impressive and more meaningful.</p>

      <p>This is why GiveCheck ranks by percentage, not absolute dollars. A bootstrapped founder giving 12% of $5K MRR demonstrates more commitment than a funded startup giving 1% of $500K MRR. The leaderboard reflects this: it's designed to reward sacrifice, not scale.</p>

      <h2>It's a Differentiation Superpower</h2>

      <p>The indie hacker market is increasingly competitive. There are multiple alternatives for almost every product category. How do you stand out when your competitor has similar features and similar pricing?</p>

      <p>A verified 10% MRG badge on your landing page is a powerful differentiator. It tells potential customers: "This founder cares about more than profit. And here's the proof." In a market where trust is everything and switching costs are low, this kind of values-based differentiation can be the deciding factor.</p>

      <h2>Community and Culture</h2>

      <p>The indie hacker community is small enough that individual actions shape the culture. When prominent indie hackers start tracking and sharing their MRG, it creates a norm. When that norm spreads, it becomes a defining characteristic of the community: "Indie hackers build profitable businesses, share openly, and give back."</p>

      <p>Imagine if the standard indie hacker Twitter bio included an MRG percentage alongside MRR. That cultural shift could channel millions of dollars to nonprofits from a community that's currently sitting on the sidelines of corporate philanthropy.</p>

      <h2>It's Financially Sustainable</h2>

      <p>Let's address the elephant in the room: "I'm barely profitable. I can't afford to give." This is a valid concern, and the answer is nuanced.</p>

      <p>First, GiveCheck is free for companies under $1K MRR. If you're pre-revenue or barely revenue, you can join the platform and start giving any percentage — even 1% — without platform fees.</p>

      <p>Second, the tax deduction reduces the effective cost. At a 30% marginal tax rate, a $100 donation costs you $70 after the deduction. A 10% MRG effectively costs about 7% of revenue after taxes.</p>

      <p>Third, and most importantly: start where you are. If 10% isn't sustainable right now, start at 2%. The habit and the public commitment matter more than the number. You can always increase later as your revenue grows. The founders who wait until they're "making enough" to start giving often never start at all.</p>

      <p>The indie hacker community has already reimagined how companies are built, funded, and grown. It's time to reimagine how they give back.</p>
    `,
  },
  {
    slug: "how-to-choose-a-nonprofit",
    title: "How to Choose a Nonprofit as a SaaS Founder",
    description:
      "A practical decision framework for choosing which nonprofits to support — covering alignment, due diligence, impact, and portfolio thinking.",
    publishedAt: "2026-04-03",
    author: "GiveCheck Team",
    category: "Guide",
    content: `
      <p>You've decided to start giving. You've connected your Stripe account. You've picked your percentage. Now comes the surprisingly hard part: choosing which nonprofit(s) to support from a universe of 1.2 million registered 501(c)(3) organizations.</p>

      <p>Here's a practical framework for making this decision without getting paralyzed by options.</p>

      <h2>Start with Alignment</h2>

      <p>The most sustainable giving happens when there's genuine alignment between you, your business, and the cause. Ask yourself:</p>

      <ul>
        <li><strong>Personal connection:</strong> Is there a cause that resonates with your personal experience? If you grew up in poverty, organizations focused on economic opportunity might feel most meaningful. If you're passionate about the environment, climate nonprofits are a natural fit.</li>
        <li><strong>Business alignment:</strong> Does the nonprofit's mission connect to what your company does? A developer tools company supporting open-source foundations creates a narrative that makes sense. An education SaaS supporting education access nonprofits is a natural story.</li>
        <li><strong>Customer alignment:</strong> What do your customers care about? If your users are developers, they'll appreciate support for organizations like the Electronic Frontier Foundation or open-source foundations. If your users are small businesses, supporting entrepreneurship programs resonates.</li>
      </ul>

      <p>Alignment matters because it makes your giving story coherent and authentic. Customers and employees can tell when a giving program is genuine versus bolted on for PR purposes.</p>

      <h2>Due Diligence: The Basics</h2>

      <p>Once you've identified a cause area, evaluate specific organizations. Here's a lightweight due diligence framework:</p>

      <ul>
        <li><strong>Financial transparency:</strong> Does the organization publish annual reports and financial statements? Check their Form 990 (available on sites like ProPublica's Nonprofit Explorer or GuideStar/Candid). Look for reasonable overhead ratios and clear program spending.</li>
        <li><strong>Track record:</strong> How long has the organization been operating? While young nonprofits can be effective, established organizations have proven they can sustain operations over time.</li>
        <li><strong>Impact reporting:</strong> Does the organization measure and report outcomes, not just activities? "We distributed 10,000 meals" is an activity. "We reduced food insecurity by 15% in our service area" is an outcome.</li>
        <li><strong>Third-party ratings:</strong> Check ratings on Charity Navigator, GiveWell, or the Animal Charity Evaluators. These organizations do deep research so you don't have to.</li>
      </ul>

      <h2>The Portfolio Approach</h2>

      <p>You don't have to pick just one nonprofit. In fact, a portfolio approach has several advantages:</p>

      <ul>
        <li><strong>Risk diversification:</strong> If one organization has a bad year or a scandal, your entire giving program isn't compromised.</li>
        <li><strong>Broader impact:</strong> Supporting multiple organizations across different cause areas creates a more diverse impact profile.</li>
        <li><strong>Easier decision-making:</strong> Instead of agonizing over "the perfect nonprofit," pick three to five and split your donation.</li>
      </ul>

      <p>GiveCheck's bucket funds implement this approach automatically. Each bucket fund is a curated portfolio of nonprofits in a specific cause area, with preset allocations. It's the easiest way to get diversified giving without any research.</p>

      <h2>The "Good Enough" Principle</h2>

      <p>Here's the most important advice in this article: <strong>don't let the perfect be the enemy of the good.</strong> The difference in impact between a "good" nonprofit and the "optimal" nonprofit is far smaller than the difference between giving and not giving at all.</p>

      <p>If you spend three months researching the perfect nonprofit and donate zero dollars during that time, you've cost nonprofits more than if you'd picked a reasonably good organization on day one. The effective altruism community has done valuable work identifying the highest-impact charities, but any giving to a verified 501(c)(3) is dramatically better than no giving.</p>

      <h2>When to Change Nonprofits</h2>

      <p>Your giving choices aren't permanent. Review your nonprofit selections annually and ask:</p>

      <ul>
        <li>Is the organization still aligned with your values and business?</li>
        <li>Have there been any red flags in their financial reporting or leadership?</li>
        <li>Has your understanding of impact in this cause area evolved?</li>
        <li>Are there new organizations doing more effective work?</li>
      </ul>

      <p>Changing nonprofits is fine and healthy. The commitment is to giving consistently — the specific recipients can evolve as you learn more. GiveCheck makes it easy to update your donation recipients at any time through the dashboard.</p>
    `,
  },
  {
    slug: "bucket-funds-explained",
    title: "GiveCheck Bucket Funds: Pooled Giving Made Simple",
    description:
      "How bucket funds work, why they exist, and why pooled giving might be the easiest way for founders to maximize their charitable impact.",
    publishedAt: "2026-04-04",
    author: "GiveCheck Team",
    category: "Education",
    content: `
      <p>Choosing which nonprofit to support from 1.2 million options is daunting. Bucket funds solve this problem by bundling curated nonprofits into themed portfolios that you can donate to with a single click. Think of them as index funds for charitable giving.</p>

      <h2>What Is a Bucket Fund?</h2>

      <p>A GiveCheck bucket fund is a curated collection of 5-15 verified nonprofits organized around a specific theme or cause area. When you donate to a bucket fund, your contribution is distributed across all organizations in the fund according to a preset allocation.</p>

      <p>For example, the <strong>Open Source Fund</strong> might include organizations like the Apache Software Foundation, the Linux Foundation, the Python Software Foundation, NumFOCUS, and the Open Source Initiative. A $500 monthly donation to this fund would be split across all five organizations based on the fund's allocation model.</p>

      <h2>Available Bucket Funds</h2>

      <p>GiveCheck offers several curated bucket funds at launch, with more planned:</p>

      <ul>
        <li><strong>Open Source Fund:</strong> Supporting the foundations and organizations that maintain critical open-source infrastructure. Ideal for developer-focused companies.</li>
        <li><strong>Climate Action Fund:</strong> A diversified portfolio of climate-focused nonprofits working on clean energy, conservation, carbon removal, and climate policy.</li>
        <li><strong>Education Access Fund:</strong> Organizations focused on education equity, digital literacy, and access to learning globally.</li>
        <li><strong>Global Health Fund:</strong> High-impact health organizations, including several recommended by GiveWell for cost-effectiveness.</li>
        <li><strong>Tech for Good Fund:</strong> Nonprofits using technology to solve social problems — digital rights, internet access, and tech education.</li>
        <li><strong>Local Impact Fund:</strong> A rotating selection of community-level organizations. Updated quarterly based on urgent needs.</li>
      </ul>

      <h2>Why Bucket Funds Make Sense</h2>

      <p>There are several compelling reasons to use bucket funds rather than selecting individual nonprofits:</p>

      <p><strong>Decision fatigue:</strong> Research shows that too many options lead to worse decisions — or no decision at all. This is called the paradox of choice, and it applies directly to charitable giving. By reducing the decision from "which of 1.2 million nonprofits?" to "which of 6 bucket funds?", the barrier to starting drops dramatically.</p>

      <p><strong>Diversification:</strong> Just as index funds outperform most individual stock picks over time, a diversified portfolio of nonprofits reduces the risk that any single organization's problems undermine your entire giving program.</p>

      <p><strong>Expert curation:</strong> The nonprofits in each bucket fund are selected by GiveCheck's team based on financial health, impact track record, organizational transparency, and sector expertise. This saves you dozens of hours of due diligence research.</p>

      <p><strong>Automatic rebalancing:</strong> If a nonprofit in a bucket fund experiences financial difficulties, loses leadership, or has other red flags, GiveCheck removes it from the fund and redistributes the allocation. You don't have to monitor individual organizations.</p>

      <h2>How Allocations Work</h2>

      <p>Each bucket fund has a defined allocation model. In most funds, the allocation is roughly equal across all included nonprofits, with slight adjustments based on organizational capacity (smaller organizations receive smaller allocations to avoid overwhelming their operations).</p>

      <p>For example, a bucket fund with 10 organizations might allocate 10% to each. A fund with organizations of varying sizes might allocate 15% to the three largest and 8.5% to the remaining five. The exact allocation is published on each fund's profile page.</p>

      <h2>Combining Bucket Funds and Direct Giving</h2>

      <p>Bucket funds and direct nonprofit donations aren't mutually exclusive. A common pattern among GiveCheck members is to direct 60-70% of their MRG to a bucket fund and 30-40% to a specific nonprofit they're passionate about. This gives you the diversification of a fund plus the personal connection of supporting an organization you care deeply about.</p>

      <p>For example, a founder with a $1,000/month MRG might allocate $700 to the Open Source Fund and $300 to a local education nonprofit where they volunteer. Both donations count toward their MRG percentage and are verified through the same API pipeline.</p>

      <h2>Creating Custom Bucket Funds</h2>

      <p>For members who want more control, GiveCheck plans to offer custom bucket funds — letting you create your own curated portfolio of nonprofits with custom allocations. This is useful for founders who've done their research and want to support a specific set of organizations without making individual donations to each one every month.</p>

      <p>Bucket funds are designed to remove friction. The less effort it takes to give well, the more likely founders are to start — and keep going. That's the whole point.</p>
    `,
  },
  {
    slug: "psychology-of-public-generosity",
    title: "The Psychology of Public Generosity in Tech",
    description:
      "Social proof, status games, and behavioral economics: understanding the psychological forces that make public giving programs effective.",
    publishedAt: "2026-04-05",
    author: "GiveCheck Team",
    category: "Thought Leadership",
    content: `
      <p>Why do people give more when others are watching? Why does a leaderboard drive more donations than a private dashboard? And why does the tech industry — built on rational optimization and data-driven decisions — respond so powerfully to social incentives around giving?</p>

      <p>The answers lie at the intersection of behavioral economics, social psychology, and the unique culture of tech entrepreneurship.</p>

      <h2>Social Proof: The Most Powerful Force in Behavior Change</h2>

      <p>Robert Cialdini's research on social proof has been replicated hundreds of times: people look to others to determine appropriate behavior. When we're uncertain about what to do, we default to what people like us are doing.</p>

      <p>In the context of charitable giving, social proof operates on multiple levels:</p>

      <ul>
        <li><strong>Existence proof:</strong> "Other founders are giving 10% of revenue? I didn't know that was a thing." The leaderboard makes giving visible and normalizes it.</li>
        <li><strong>Calibration:</strong> "The median giving percentage is 7%. I should probably be giving at least that." Public data creates reference points that influence individual decisions.</li>
        <li><strong>Peer pressure:</strong> "My competitor is in the 10% Club and I'm not even on the leaderboard." Social comparison drives action, especially in competitive communities.</li>
      </ul>

      <p>GiveCheck's leaderboard is designed to maximize these social proof effects. By showing real companies with real percentages, it creates a powerful signal: giving is normal, giving is measurable, and giving is something successful founders do.</p>

      <h2>Status Games and Signaling Theory</h2>

      <p>Economist Thorstein Veblen first described "conspicuous consumption" in 1899 — the idea that people spend money on visible goods to signal social status. A century later, tech culture has created its own version: conspicuous achievement. Revenue milestones, team sizes, funding rounds, and Twitter followers are all forms of status signaling.</p>

      <p>GiveCheck introduces <strong>conspicuous generosity</strong> as a new status signal. The 10% Club badge, the leaderboard ranking, the public MRG percentage — these are all signals that say "I'm successful enough to give generously, and principled enough to actually do it."</p>

      <p>Crucially, this is a status game that creates real value. Traditional status signals are often zero-sum (one person's funding announcement makes others feel behind) or wasteful (luxury consumption doesn't benefit anyone else). Conspicuous generosity is positive-sum: the status-seeking behavior produces genuine social good.</p>

      <h2>Loss Aversion and the Gray Badge</h2>

      <p>Daniel Kahneman's research on loss aversion shows that people feel losses about twice as intensely as equivalent gains. GiveCheck leverages this insight through the badge enforcement mechanism.</p>

      <p>Once a founder has earned their verified badge and built a public track record, the prospect of losing it — having the badge go gray, dropping off the leaderboard — is a powerful motivator to maintain giving even during tough months. The pain of losing status exceeds the pleasure of gaining it, which means the badge system creates a ratchet effect: it's psychologically harder to stop giving than it was to start.</p>

      <h2>Identity and Consistency</h2>

      <p>Social psychologist Robert Cialdini identified commitment and consistency as a key principle of influence. Once people make a public commitment, they feel internal pressure to behave consistently with that commitment. This is why public New Year's resolutions are more effective than private ones.</p>

      <p>GiveCheck turns giving into a public identity. When a founder embeds the badge on their website, shares their leaderboard position on social media, and mentions their MRG in conversations, they're making a public commitment. From that point on, stopping feels like a betrayal of their stated identity — creating a self-reinforcing loop that sustains giving behavior long after the initial motivation fades.</p>

      <h2>The Endowment Effect for Social Impact</h2>

      <p>The endowment effect describes how people overvalue things they already possess. In the context of GiveCheck, founders who've built a 12-month giving streak, a top-20 leaderboard position, or a 10% Club badge feel ownership over those achievements. They're reluctant to "lose" them even if the rational cost of continuing to give is high.</p>

      <p>This is a feature, not a bug. The endowment effect for giving credentials means that the longer someone participates, the stickier the behavior becomes. It transforms giving from a monthly decision into a default state — exactly what nonprofits need from their donors.</p>

      <h2>Designing for Good Behavior</h2>

      <p>Every feature of GiveCheck is informed by these behavioral insights. The leaderboard leverages social proof and competition. The badge leverages identity and consistency. The gray badge leverages loss aversion. The 10% Club leverages aspiration and goal-setting. The bucket funds leverage default effects (making the easy path the generous path).</p>

      <p>The tech industry has spent two decades using behavioral psychology to get people to click ads, buy products, and stay on platforms. GiveCheck uses the same psychology to get founders to give more, give consistently, and give publicly. Same tools, better outcomes.</p>
    `,
  },
  {
    slug: "building-giving-in-public",
    title: "Building in Public + Giving in Public: The Next Status Symbol",
    description:
      "The build-in-public movement meets charitable giving. How MRG is becoming the next metric founders share — and why it matters.",
    publishedAt: "2026-04-07",
    author: "GiveCheck Team",
    category: "Thought Leadership",
    content: `
      <p>The "build in public" movement transformed how founders communicate. Instead of hiding behind polished marketing, founders started sharing everything: revenue numbers, user counts, churn rates, failures, and lessons. It created a culture of transparency that attracted customers, collaborators, and community.</p>

      <p>Now a new layer is emerging: <strong>giving in public.</strong> And we believe it will become the defining status symbol for the next generation of founders.</p>

      <h2>The Evolution of Founder Status</h2>

      <p>Think about how founder status signals have evolved over the past decade:</p>

      <ul>
        <li><strong>2015-2018:</strong> "I raised a $10M Series A." Funding was the primary status signal. The more money you raised, the more important you were.</li>
        <li><strong>2018-2021:</strong> "I hit $10K MRR bootstrapped." The indie hacker movement shifted status from fundraising to revenue. Building a profitable, independent business became aspirational.</li>
        <li><strong>2021-2024:</strong> "I build in public — here's my dashboard." Transparency became the status signal. Sharing your numbers openly — good and bad — was braver than hiding behind a corporate facade.</li>
        <li><strong>2025-now:</strong> "I give 10% of my revenue, verified." The next evolution combines transparency with generosity. It's not enough to build a successful business publicly — the question becomes "what are you doing with that success?"</li>
      </ul>

      <p>Each evolution raised the bar. Fundraising was easy to signal but said nothing about sustainability. Revenue proved you could build something people would pay for. Transparency proved you had the confidence to be honest. Giving proves you have the values to share your success with the world.</p>

      <h2>Why Giving Is the Ultimate Signal</h2>

      <p>In signaling theory, the most credible signals are those that are costly to fake. This is why a medical degree signals competence (it costs years of effort) while a self-proclaimed "guru" title doesn't (it costs nothing).</p>

      <p>A verified 10% MRG is a costly signal. It means you're literally giving away 10% of your revenue every month, verified by API, visible to the world. You can't fake it. You can't buy it. You can only earn it by sustained, genuine generosity. This makes it an incredibly powerful status symbol — one that can't be inflated, gamed, or purchased.</p>

      <p>Contrast this with other founder signals: revenue can be temporarily inflated through discounts or tricks. Funding announcements can mask terrible unit economics. Even transparency can be selective — sharing the metrics that look good while hiding the ones that don't. But MRG is binary and objective: either the money moved from your Stripe to verified nonprofits, or it didn't.</p>

      <h2>The MRG in the Bio</h2>

      <p>Today, founder Twitter bios commonly include revenue milestones: "Building @ProductName | $30K MRR | Bootstrapped." We predict that within two years, the standard indie hacker bio will also include giving metrics: "Building @ProductName | $30K MRR | 10% MRG | Bootstrapped."</p>

      <p>This isn't vanity — it's values signaling. Including your MRG in your bio says: "I'm not just building a successful business. I'm building one that gives back, and I'm transparent about it." It creates a new benchmark for what "success" means as a founder.</p>

      <h2>The Network Effect of Giving in Public</h2>

      <p>When one founder shares their MRG publicly, it's a novelty. When ten do it, it's a trend. When a hundred do it, it's a norm. And once it's a norm, founders who don't share their MRG start feeling conspicuously absent — the same way a founder who won't share revenue numbers in 2026 is viewed with suspicion.</p>

      <p>This network effect is what transforms individual generosity into a movement. Each founder who gives in public makes it easier and more expected for the next one. The GiveCheck leaderboard accelerates this by providing a centralized, public record that anyone can reference.</p>

      <h2>Beyond Individual Giving: Company Identity</h2>

      <p>Giving in public doesn't just affect founder personal brands — it becomes part of company identity. When your product's landing page features a GiveCheck badge, it tells potential customers that generosity is baked into the company's DNA, not bolted on as a PR afterthought.</p>

      <p>Some GiveCheck members have gone further, making their giving percentage a core part of their pricing page: "Our pricing is transparent: $29/month for the product, and we give 10% of that revenue to verified nonprofits. Here's the proof." This level of transparency turns generosity from a nice-to-have into a selling point.</p>

      <h2>The Cultural Shift</h2>

      <p>We're at an inflection point in tech culture. The hustle-culture era of "move fast and break things" is giving way to something more thoughtful. Founders are asking harder questions: What is my company for? What's the point of building wealth if I don't use it well? How do I want to be remembered?</p>

      <p>Giving in public is one answer to these questions. It's a tangible, measurable way to embed purpose into the daily practice of building a business. Not through mission statements or corporate values posters, but through verified dollars flowing to causes that matter.</p>

      <p>The founders who adopt MRG tracking early won't just be donors — they'll be pioneers of a new paradigm. One where success is measured not only by what you earn, but by what you give. And where "building in public" means sharing the full picture: the revenue, the growth, the challenges, and the generosity.</p>

      <p>The status game is shifting. The question is no longer just "how much do you make?" It's "how much do you give?" And for the first time, there's a way to answer that question with verified proof.</p>
    `,
  },
  {
    slug: "public-giving-verification-new-organic-certification",
    title: "Public Giving Verification Is the New Organic Certification",
    description:
      "Organic certification transformed how consumers trust hidden processes. Public donation verification is doing the same thing for corporate giving — and this time, small companies can actually compete.",
    publishedAt: "2026-04-09",
    author: "GiveCheck Team",
    category: "Thought Leadership",
    content: `
      <p>Walk into any grocery store and the "USDA Organic" label is everywhere. It's on apples and cereal boxes and baby food. Consumers reach for it instinctively — not because they watched how the food was grown, but because a trusted third party verified that it was grown the right way and put a stamp on it.</p>

      <p>That label changed the world. But it came at a cost that left a lot of people behind.</p>

      <h2>What Organic Certification Actually Did</h2>

      <p>Before organic certification existed, "organic farming" was a vague promise. Small farms might have been using pesticide-free methods for generations, but there was no way for a consumer at a grocery store to know that. The process — no synthetic pesticides, no GMOs, cover cropping, composting — was invisible. The end product looked the same. The effort was hidden.</p>

      <p>Certification changed that. For the first time, a hidden positive process became legible to a consumer who wasn't there to witness it. The label was a shorthand that collapsed a complex, months-long agricultural story into a single trusted signal: <em>someone verified this.</em></p>

      <p>It worked. The organic food market grew from a niche into a $60 billion industry. Consumers began paying premiums for certified products. Retailers created dedicated sections. Being organic became a competitive advantage.</p>

      <h2>But Organic Certification Has a Problem</h2>

      <p>Here's what didn't make the story: organic certification is expensive, slow, and structurally biased toward large operations.</p>

      <p>USDA organic certification requires annual inspections, detailed record-keeping, paperwork, fees, and a transition period of at least three years — during which you farm organically but can't yet use the label or charge organic prices. The total cost for a small farm can run into thousands of dollars per year before you see a single certified dollar in return. For a large industrial operation, that cost amortizes across millions of units. For a family farm with three acres of mixed vegetables, it can be existential.</p>

      <p>The result: many of the farms that actually pioneered organic methods — small, local, community-rooted operations that were doing this before it had a name — either couldn't afford to certify or decided the economics didn't work. Meanwhile, large agricultural conglomerates built organic certification divisions, scaled the paperwork, and captured the premium. The label that was supposed to signal genuine commitment to sustainable agriculture became partly captured by the very industrial model it was reacting against.</p>

      <p>This is a familiar dynamic. When verification is costly, it gates out the authentic small players and advantages the institutions with compliance budgets. The signal gets captured.</p>

      <h2>Corporate Giving Has the Same Problem</h2>

      <p>Now look at corporate charitable giving. The equivalent of "organic farming before certification" is happening right now, at thousands of small SaaS companies, indie bootstrappers, and founder-led businesses. They're genuinely donating a percentage of revenue. They care about it. They've built it into their operations. And nobody knows.</p>

      <p>The hidden positive process problem is identical. A consumer evaluating two competing SaaS tools — one that donates 10% of revenue to verified nonprofits, one that doesn't give at all — cannot tell them apart from a landing page. The giving is invisible. The effort doesn't register.</p>

      <p>Large companies have tried to address this with impact reports, ESG frameworks, and corporate social responsibility programs. But these are the organic-certification-for-large-operations equivalent: slow, expensive, jargon-heavy, and mostly meaningful at a scale that indie founders and small businesses can't reach. An annual ESG report requires legal review, communications teams, investor relations alignment. A one-person SaaS company doing $8K MRR doesn't have any of that.</p>

      <p>So the small companies doing genuine, consistent, meaningful giving — the ones who arguably embody the spirit of the thing — have no way to credibly signal it. And the consumers who would value it have no way to see it.</p>

      <h2>API Verification Changes the Economics</h2>

      <p>This is where public donation verification diverges from organic certification in an important way: the economics are fundamentally different.</p>

      <p>Organic certification is expensive because verification requires physical inspection. Someone has to travel to your farm, walk your fields, review your soil logs, check your supplier receipts, and sign off on your practices. That labor costs money, and it costs the same regardless of how big your farm is.</p>

      <p>Donation verification through APIs costs essentially nothing at scale. GiveCheck connects to Stripe to read your revenue and to Every.org to confirm your donations. The "inspection" is automated. It happens continuously, not annually. There's no travel, no paperwork, no transition period. A solo founder at $2K MRR gets the same verification infrastructure as a Series A startup at $500K MRR.</p>

      <p>This is the structural unlock. When verification is API-native, the cost barrier that made organic certification exclusionary disappears. The small company doing genuine, consistent giving can earn a verified badge on day one at the same cost as anyone else — which is to say, nearly zero.</p>

      <p>For the first time, the signal is democratized. Small players can compete.</p>

      <h2>The Label Still Has to Mean Something</h2>

      <p>Organic certification's power came from the label being hard to fake. The three-year transition period, the annual inspections, the paper trail — these created friction that made the label credible. A consumer could trust the stamp because gaming it required sustained effort and real commitment.</p>

      <p>A verified giving badge has to work the same way. This is why self-reported giving pledges — "we donate 1% of revenue" printed on a website — haven't moved the market. They're costless to put up and costless to ignore. The absence of verification makes the claim nearly worthless as a signal.</p>

      <p>API-based verification restores the credibility that self-reporting lacks. When a GiveCheck badge displays "Verified: 10% MRG," it means Stripe confirmed the revenue and Every.org confirmed the donations. The money moved. The verification is continuous, not annual. You can't put up the badge one month and quietly stop giving the next — it will go gray. The signal has the friction it needs to stay meaningful.</p>

      <h2>The Consumer Behavior Shift Already Happened Once</h2>

      <p>Here's the thing about organic certification that's easy to forget: before the label existed, most consumers didn't think about pesticides when buying produce. It wasn't part of their evaluation criteria. The certification didn't just signal a process — it created the category of concern.</p>

      <p>Once the label was visible and consistent, consumers started paying attention to it. It became a habit. Today, millions of people reach for organic products without consciously analyzing the decision. The label conditioned a new purchasing reflex.</p>

      <p>The same potential exists for verified giving. Right now, most consumers don't think about their SaaS tools' giving practices when choosing between options. It's not part of their evaluation criteria — not because they don't care, but because the signal has never been legible. There's been nothing to look for.</p>

      <p>Put a clear, consistent verified giving badge in front of enough consumers, across enough products, for long enough — and the evaluation criterion gets created. Consumers start looking for it. The absence of a badge starts to register. "Why doesn't this product have a giving verification?" becomes a reasonable question to ask.</p>

      <p>This is what organic certification took a decade to accomplish. API-native verification can move faster.</p>

      <h2>What Authentic Small Players Gain</h2>

      <p>There's a version of this story where large companies capture the giving-verification signal the same way they captured organic certification — by hiring compliance teams to manage the badge, running it through PR departments, and optimizing it as a marketing asset rather than a genuine commitment.</p>

      <p>That will happen to some degree. It always does.</p>

      <p>But the structural difference matters. Because the verification is API-continuous rather than annual-inspection-based, the badge tracks real behavior in real time. You can't fake a year of consistent 10% MRG with a one-time donation in December. You either did it every month or you didn't, and the data knows.</p>

      <p>This creates a genuine advantage for the small founder who started giving on day one and never stopped. Their giving history is a credential that takes time to earn and can't be backdated. A company that starts a giving program to acquire the badge in month one has a shallower history than a founder who's been doing it for two years. The leaderboard rewards consistency, and consistency is harder for large, bureaucratic organizations to manufacture than it is for a solo founder who just automated a Stripe donation on signup.</p>

      <p>The farmers who were doing organic agriculture before it had a name — they deserved the label more than anyone. And many of them got crowded out. Public donation verification has a shot at getting this right: keeping the signal credible, keeping it democratic, and letting the authentic early movers keep the advantage they've earned.</p>

      <h2>The Shorthand Is What Scales</h2>

      <p>Most consumers can't read a Stripe dashboard or parse an Every.org API response. What they can read is a badge.</p>

      <p>This is what organic certification understood: the mechanism can be complex, but the consumer-facing signal has to be simple. "USDA Organic" is four syllables. It encodes a regulatory framework, an inspection regime, and a set of agricultural standards — and it communicates all of that to a consumer in a fraction of a second.</p>

      <p>A verified giving badge works the same way. The consumer doesn't need to understand how MRG is calculated or what Every.org does. They need to see a badge that says "this company gives, and it's verified" — and trust that the verification is real.</p>

      <p>Build that trust, sustain the integrity of the signal, and the shorthand scales. It becomes the thing you look for. The thing whose absence you notice. The thing that changes behavior in aggregate, one glance at a time.</p>

      <p>That's what organic certification did for food. Public donation verification can do it for business.</p>
    `,
  },
  {
    slug: "givecheck-vs-founders-pledge",
    title: "GiveCheck vs. Founders Pledge: Two Models for Founder Philanthropy",
    description:
      "Founders Pledge and GiveCheck both help entrepreneurs give. But they answer very different questions — one is about your exit, the other is about right now.",
    publishedAt: "2026-04-10",
    author: "GiveCheck Team",
    category: "Comparison",
    content: `
      <p>If you're a founder thinking seriously about giving, you've probably come across both Founders Pledge and GiveCheck. Both exist to help entrepreneurs do more with their charitable impulses. Both serve founders. Both care about verified, meaningful impact rather than vague good intentions.</p>

      <p>But they're built around fundamentally different moments in a founder's life — and understanding that difference will tell you which one (or both) belongs in your giving strategy.</p>

      <h2>The Core Difference: When Do You Give?</h2>

      <p>This is the most important thing to understand about the two models.</p>

      <p><strong>Founders Pledge is about your exit.</strong> When you join, you make a legally binding pledge to donate a percentage of your personal proceeds from a future liquidity event — an acquisition, IPO, or secondary sale. The money doesn't move today. You're making a commitment now that will execute when you unlock wealth you don't yet have. The pledge is real and binding, but the giving is deferred.</p>

      <p><strong>GiveCheck is about right now.</strong> It measures what you're donating each month, as a percentage of your current Monthly Recurring Revenue, verified in real time via your Stripe integration. There's no exit required. There's no future event to wait for. If you have $3,000 MRR today and you're giving $300 of it to verified nonprofits, your MRG is 10% and that's what your badge reflects — this month, not someday.</p>

      <p>Neither model is better in the abstract. They solve different problems.</p>

      <h2>What Founders Pledge Does Well</h2>

      <p>Founders Pledge has built something genuinely impressive. With $12.9 billion pledged across 2,252+ founders in 45+ countries, and $1.7 billion already deployed to charities, it's one of the largest organized philanthropic networks for entrepreneurs in the world.</p>

      <p>Their focus on <strong>research-backed giving</strong> is a real differentiator. Founders Pledge employs researchers who deeply evaluate cause areas — global health, climate, catastrophic risk, patient philanthropy — and recommend specific organizations within them. For a founder who wants someone else to do the homework on where their money will have the most impact, this is enormously valuable.</p>

      <p>They also offer <strong>Donor Advised Fund management</strong>, which is ideal for large lump-sum donations. When you exit a company and receive $10 million, you don't want to immediately wire that to twenty different nonprofits. A DAF lets you donate the full amount into a tax-advantaged vehicle now and deploy it to recipients over time. Founders Pledge manages this infrastructure for their members.</p>

      <p>The <strong>community and network</strong> is another genuine asset. Being in a room — or a Slack channel, or a dinner — with 2,000+ other founders who have made formal philanthropic commitments creates a culture of giving that compounds over time.</p>

      <p>For a VC-backed founder on a trajectory toward a significant liquidity event, Founders Pledge is a natural fit. It formalizes a commitment you plan to honor anyway and provides the infrastructure to honor it well.</p>

      <h2>What Founders Pledge Doesn't Cover</h2>

      <p>Here's the gap: most founders will never have a venture-scale exit. The median bootstrapped SaaS company gets acquired for somewhere between 3x and 5x ARR if it gets acquired at all. Many successful indie founders run profitable businesses for a decade and never experience a liquidity event in the traditional sense — they just pay themselves a salary and eventually wind down or sell for a modest multiple.</p>

      <p>More importantly, even founders who <em>will</em> have an exit are building for years or decades before it happens. The pledge structure is silent on that entire chapter. It doesn't ask: what are you doing with the revenue you're generating right now? It doesn't create accountability for monthly giving. It doesn't put a verified badge on your website that signals your values to customers and candidates during the years you're actually building.</p>

      <p>And there's the $12.9B vs. $1.7B gap worth noting: $12.9 billion has been pledged, but only $1.7 billion has been deployed. That's not a criticism — many pledges are attached to exits that haven't happened yet — but it illustrates that pledge-based giving is structurally deferred. The commitment is real; the impact waits.</p>

      <h2>What GiveCheck Does Well</h2>

      <p>GiveCheck was built around a question Founders Pledge doesn't answer: <em>what percentage of your revenue are you giving away, continuously, right now?</em></p>

      <p>The <strong>MRG metric</strong> — Monthly Recurring Giving as a percentage of MRR — treats charitable giving the same way you treat any operating expense: as a recurring line item, not a once-in-a-career event. This creates accountability that compounds month over month. You can't pledge your way to a GiveCheck badge. You have to actually give, every month, and the API verifies it.</p>

      <p><strong>Verification is continuous and automatic.</strong> GiveCheck connects to Stripe for your revenue figure and to Every.org for your donation confirmation. No paperwork, no annual review, no honor system. The badge goes active when the money moves and goes gray when it stops. This makes the signal meaningful in a way that self-reported pledges cannot match.</p>

      <p>GiveCheck is also structurally <strong>accessible at any scale</strong>. A solo founder at $2,000 MRR participates on equal footing with a team at $200,000 MRR. The percentage is what matters, and the verification infrastructure costs the same for both. This is the democratization that traditional certification models struggle with — the API makes it free to verify regardless of size.</p>

      <p>The <strong>public leaderboard and embeddable badge</strong> create a marketing and trust signal that's visible during the years you're building. A customer evaluating your product sees "Verified: 10% MRG" before they know anything about your exit plans. That shapes how they experience your brand right now.</p>

      <h2>Who Should Use Each</h2>

      <p>The honest answer is that these tools serve genuinely different moments and goals — and many founders will eventually want both.</p>

      <p><strong>Use Founders Pledge if:</strong> you're on a venture-backed trajectory and anticipate a significant liquidity event; you want expert guidance on where your charitable dollars will have the highest evidence-backed impact; you want to formalize a large future commitment in a legally binding way; or you're looking for a network of other founders who've made similar commitments.</p>

      <p><strong>Use GiveCheck if:</strong> you're already generating revenue and want to give from it monthly, right now; you want a verified, public signal of your giving that customers and candidates can see today; you're bootstrapped, indie, or running a lifestyle business and will never have a venture exit; or you want to track your giving percentage the same way you track MRR — as a live, measurable metric.</p>

      <p><strong>Use both if:</strong> you're a venture-backed founder who wants to formalize an exit pledge <em>and</em> build a culture of giving during the building years. Founders Pledge covers the destination; GiveCheck covers the journey.</p>

      <h2>The Bigger Picture</h2>

      <p>The existence of both tools points to something meaningful: founder philanthropy is maturing. The question is no longer whether founders should give — it's about how to structure giving so it's consistent, verified, and integrated into how a business actually operates.</p>

      <p>Founders Pledge proved that entrepreneurs would make formal philanthropic commitments if given the right vehicle and community. GiveCheck extends that logic into the operating rhythm of the business itself — the monthly cadence of revenue and giving that any active founder can participate in, not just those waiting for a nine-figure exit.</p>

      <p>The goal, ultimately, is a world where giving is as standard a part of running a business as paying for hosting. Founders Pledge has moved the needle for a certain kind of founder. GiveCheck is built for everyone who's building right now.</p>
    `,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedPosts(currentSlug: string, count = 3): BlogPost[] {
  const current = getBlogPost(currentSlug);
  if (!current) return blogPosts.slice(0, count);

  // Prefer same category, then different
  const sameCategory = blogPosts.filter(
    (p) => p.slug !== currentSlug && p.category === current.category
  );
  const different = blogPosts.filter(
    (p) => p.slug !== currentSlug && p.category !== current.category
  );

  return [...sameCategory, ...different].slice(0, count);
}
