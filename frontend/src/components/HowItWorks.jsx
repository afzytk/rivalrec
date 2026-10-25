const HowItWorks = () => {
  return (
    <section id="how-it-works" className="px-6 py-20 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-14 text-center">
          <p className="text-primary mb-3 text-sm font-semibold tracking-[0.2em] uppercase">
            Get Started
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How It Works
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Organize your matches, track your results, and bring your gaming
            community together with RivalRec.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <article className="rounded-2xl border border-slate-200 bg-white/80 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-primary flex size-12 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold">
                01
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900">Sign Up</h3>

            <p className="mt-3 leading-7 text-slate-600">
              Create your RivalRec account and get ready to manage your matches
              and tournaments in one place.
            </p>
          </article>

          {/* Step 2 */}
          <article className="rounded-2xl border border-slate-200 bg-white/80 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-primary flex size-12 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold">
                02
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Track Friendly Matches
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Set up friendly matches, record results, and keep track of match
              history with your friends.
            </p>
          </article>

          {/* Step 3 */}
          <article className="rounded-2xl border border-slate-200 bg-white/80 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-primary flex size-12 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold">
                03
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Organize Tournaments
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Create a tournament, configure its setup, organize participants,
              and manage the competition.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
