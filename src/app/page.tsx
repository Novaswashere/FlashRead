"use client";

import React from "react";
import { useLibrary } from "@/features/library/hooks/useLibrary";
import { useSettings } from "@/features/settings/hooks/useSettings";

export default function HomePage() {
  const { books } = useLibrary();
  const { settings } = useSettings();

  return (
    <main className="pt-24 pb-32 max-w-container-max mx-auto px-space-md md:px-space-xl md:pl-72">
      {/* Continue Reading (Hero) */}
      <section className="mb-space-xl">
        <h2 className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest mb-space-sm">
          Continue Reading
        </h2>
        <div className="group relative overflow-hidden bg-surface-container-lowest border border-border-subtle rounded-xl flex flex-col md:flex-row items-center gap-space-lg p-space-lg transition-all hover:border-primary/20">
          <div className="relative w-full md:w-48 h-64 flex-shrink-0 bg-surface-container-high rounded-lg overflow-hidden border border-border-subtle shadow-sm">
            <img
              className="w-full h-full object-cover"
              alt="The Metamorphosis Book Cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtLGCuclF4GLf7zhOkocYn5ZHL16XHzD33LTwnhZCU-bhhwhLy2dfS0KYRPuNg_AYMVEY2_pzcnutU9ar7a4uld5aT1KChjdUXain_32Tu291dC_vp8g3JmDNDCYE4WSAJOxvtvZdJpQQd8tfNbrqp82_r2AMCnAP7RvFhpMhkD8uxoIomjsBP44KDXOmpMC7mUAeBPVhob4ZW_S6s1rW56u_Dp5pxbxBX6g5M7YErt52vYJxZG45o3HT1DsqKwb7WQqmEacCqF9Ie"
            />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest">
              <div className="h-full bg-primary" style={{ width: "64%" }}></div>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center py-space-sm w-full">
            <div className="flex items-center gap-space-sm mb-space-xs">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                bolt
              </span>
              <span className="font-label-mono text-label-mono text-primary font-bold">ACTIVE SESSION</span>
            </div>
            <h3 className="font-headline-lg text-headline-lg mb-space-xs">The Metamorphosis</h3>
            <p className="text-on-surface-variant mb-space-lg">Franz Kafka • 64% Complete</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-lg mb-space-xl">
              <div>
                <p className="font-label-mono text-label-mono text-on-surface-variant mb-1">CURRENT SPEED</p>
                <p className="font-label-mono text-body-lg font-bold text-primary">
                  {settings.defaultWPM} <span className="text-xs font-normal">WPM</span>
                </p>
              </div>
              <div>
                <p className="font-label-mono text-label-mono text-on-surface-variant mb-1">TIME REMAINING</p>
                <p className="font-label-mono text-body-lg font-bold">
                  18 <span className="text-xs font-normal">MIN</span>
                </p>
              </div>
            </div>
            <button className="flex items-center justify-center gap-space-sm bg-primary text-on-primary px-space-lg h-12 rounded-lg font-bold active:scale-95 transition-all w-fit">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
              <span>RESUME READING</span>
            </button>
          </div>
          {/* Abstract Decorative Element */}
          <div className="absolute top-0 right-0 p-space-lg opacity-5 pointer-events-none hidden md:block">
            <span className="material-symbols-outlined text-[120px]">auto_stories</span>
          </div>
        </div>
      </section>

      {/* Recently Opened */}
      <section className="mb-space-xl">
        <div className="flex items-center justify-between mb-space-md">
          <h2 className="font-headline-md text-headline-md">Recently Opened</h2>
          <button className="text-primary font-label-mono text-label-mono font-bold hover:underline">VIEW ALL</button>
        </div>
        <div className="flex gap-space-lg overflow-x-auto hide-scrollbar pb-space-sm -mx-space-md px-space-md md:mx-0 md:px-0">
          {/* Recent Item 1 */}
          <div className="flex-shrink-0 w-40 group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-border-subtle bg-surface-container transition-transform group-hover:-translate-y-1">
              <img
                className="w-full h-full object-cover"
                alt="Atomic Habits"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNqNU_ACjnfE3dhFU2RZIyKPSpfAPq_UJOudRHu8ZMol33BdPur0aYrnCz0D5cin_3Jdec7EfebXoyvow2dgLQTlzc3wBlDGRFj6osNnh4cSdbqht38IT-wTcKwV0olue-gnnclElsIVSwRwsqCTyu_V1P621QoOmDhw7QN9jpx848NOHwl6JAmeY1dAGGJUgvDf0fc3QBar99U0cvpnX-ZFy4qnLDtCWKArYa3k27xAtE-oWZoAJ1mJBD3NRsoLnbMd2T3VanXHTR"
              />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest">
                <div className="h-full bg-primary" style={{ width: "82%" }}></div>
              </div>
            </div>
            <h4 class="font-body-md font-semibold mt-space-sm truncate">Atomic Habits</h4>
            <p className="font-label-mono text-label-mono text-on-surface-variant truncate">James Clear</p>
          </div>
          {/* Recent Item 2 */}
          <div className="flex-shrink-0 w-40 group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-border-subtle bg-surface-container transition-transform group-hover:-translate-y-1">
              <img
                className="w-full h-full object-cover"
                alt="Deep Work"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuChApKsrU3z_kfA4VpXAEjZeECtFtSp0jsu1clkHad-FQIrTlKiooOnQlDySQYbHS6HKFtgD46whBFGPJfAj3BlrCeFPVORCydtF4zCi_in88ixIxjLpffGEWZwhsgzDHo7FJkfevh5c3Gf-2K1MyXwYotpVJ6radbz4YSMH07xKJZvVfNji6ybavzYR29xK0xVseyZlSp7sav_pk-zhup9ZLr4waNGaNB1DfsWWD0LqlBW7cIQ1Mlt0WopdZnmM14vhjSBvahEaFxW"
              />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest">
                <div className="h-full bg-primary" style={{ width: "20%" }}></div>
              </div>
            </div>
            <h4 class="font-body-md font-semibold mt-space-sm truncate">Deep Work</h4>
            <p className="font-label-mono text-label-mono text-on-surface-variant truncate">Cal Newport</p>
          </div>
          {/* Recent Item 3 */}
          <div className="flex-shrink-0 w-40 group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-border-subtle bg-surface-container transition-transform group-hover:-translate-y-1">
              <img
                className="w-full h-full object-cover"
                alt="The Great Gatsby"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBD92WrIjkjH1wGzu0ThtgQ9PgI2I19wYi4aArsknnfVoy7LAitNjWVRkXMYuxVgeoQonX_0klWGpJzmx6d3MYZ__vCtiyVmb02Jte0JTmkbg3SW3F8WApMoxC2kNKZj7RFkeXXBCM1hZPh95N0-nJHdgfd1fs8aijk1zwPhQ_6qfQbp_rvd5LRYJruSv9vI3-VOANrMj4der79ALBK5ET9LRBqKm2Qj6evfsG3W9E1SzKpOLaWpN5XgWWbIQdm38ucq41vbZ8VaarP"
              />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest">
                <div className="h-full bg-primary" style={{ width: "0%" }}></div>
              </div>
            </div>
            <h4 class="font-body-md font-semibold mt-space-sm truncate">The Great Gatsby</h4>
            <p className="font-label-mono text-label-mono text-on-surface-variant truncate">F. Scott Fitzgerald</p>
          </div>
          {/* Recent Item 4 */}
          <div className="flex-shrink-0 w-40 group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-border-subtle bg-surface-container transition-transform group-hover:-translate-y-1">
              <img
                className="w-full h-full object-cover"
                alt="Thinking Fast and Slow"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy-wRJ_UiIC_ggsEbc_4X-XdoCQeY9hNSfB4AUfaGIzTOttsBwy81v5SFnnYbStmM-OVeNZZOdx0K_ywZZcc8kybdL0tPoVtyvvYNByzYGgrwXbJI-VzJFMtacJtB15YCNVVgD3NKCyxsdZ2nACMyYPMj6m_kKE1aIo5mDiUMdXrFqVLefyCFBMD1oK4sPr586y_oSa6A9kGv9yXUL74bwoow0V6FVDPwxz3ZNrUM5gb3mZgNl5982CnLgWAC-ReWxEsxrg5tN70mc"
              />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest">
                <div className="h-full bg-primary" style={{ width: "12%" }}></div>
              </div>
            </div>
            <h4 class="font-body-md font-semibold mt-space-sm truncate">Thinking Fast and Slow</h4>
            <p className="font-label-mono text-label-mono text-on-surface-variant truncate">Daniel Kahneman</p>
          </div>
        </div>
      </section>

      {/* Library Grid */}
      <section>
        <div className="flex items-center justify-between mb-space-lg">
          <h2 className="font-headline-md text-headline-md">My Library</h2>
          <div className="flex items-center gap-space-sm">
            <button className="p-2 rounded-lg border border-border-subtle hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
            </button>
            <button className="p-2 rounded-lg border border-border-subtle hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">grid_view</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-space-lg gap-y-space-xl">
          {/* Library Item 1 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-border-subtle bg-surface-container-low transition-all group-hover:shadow-lg">
              <img
                className="w-full h-full object-cover"
                alt="Dune"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkrhpxz0ZHrxtmL2uJ_o0b7C31Kzod8_WXxWgYgLBemy1KzMewQ8w7a91yqnnXf3-xe6VdPB2jAl92D8Li0urcXuGVm2mixUUkn0uNCL_xKTk4S_L_TevCOJ6giou7MUiZorHN9kK7-SLjft1P7qi39gz21chGYAWzWWkyl_bS9ScJDu6_l9UUgHxQwAsvfuIj-chX6Bw9MB0Aw9Fdz4BzNvR2Pk1pUU1_wVn2oCjhWLxIp5i52HnkIUK_PNLK16F2yLGei1O5PlIf"
              />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest"></div>
            </div>
            <h4 class="font-body-md font-semibold mt-space-sm leading-tight">Dune</h4>
            <p className="font-label-mono text-label-mono text-on-surface-variant">Frank Herbert</p>
          </div>
          {/* Library Item 2 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-border-subtle bg-surface-container-low transition-all group-hover:shadow-lg">
              <img
                className="w-full h-full object-cover"
                alt="1984"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAN3aq_eu2U_hOlfN3Xsqfxhno6ogURtmZT2dijej6Tpw_mbgYnCAHrW1xrzXRSJGIavIr2e2-6xfK0j2MqKIhIa-AvxQc1tFbyn5SrkAe75R7nIE4E8mV3Nb2b33KczXgMT48b8A0ZipfO8ajGk7WNtTmcaIu81EngbVNyG18L1veN4wvy27UgMdBELOo6hlWkLwKja1Fjtx0yXQQnoHicVnZS7e3D1G_sdc50kbMOBFB4xexBog0ZCG_wFrSf6yO0i_ow2MPAgGW1"
              />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest"></div>
            </div>
            <h4 class="font-body-md font-semibold mt-space-sm leading-tight">1984</h4>
            <p className="font-label-mono text-label-mono text-on-surface-variant">George Orwell</p>
          </div>
          {/* Library Item 3 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-border-subtle bg-surface-container-low transition-all group-hover:shadow-lg">
              <img
                className="w-full h-full object-cover"
                alt="Brave New World"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbqgbfKTCGUumedVRP7GRgUOqiOzCJsKRNbDf9YcQYKkWQnYceF0L10o2EJmnj6b7pA1dmYtHHlB-c6vrZ57zvHYvjFwsp-5JBaRQGY_ZIAq-0T7_OD2rcd5t3pnkGuJeaet0rFY3c7yeWPDIptaAH15DRR2hl83Px5n3pbDddwpXAarkaTfPU4s_I380WybWHsNetYaGkuFOU_ouHFWswB44Xc0RQyaXCNOTf0Zzs9d-t6_MS9MtU6JJfm8vzYGur6LOS8keUyLws"
              />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest"></div>
            </div>
            <h4 class="font-body-md font-semibold mt-space-sm leading-tight">Brave New World</h4>
            <p className="font-label-mono text-label-mono text-on-surface-variant">Aldous Huxley</p>
          </div>
          {/* Library Item 4 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-border-subtle bg-surface-container-low transition-all group-hover:shadow-lg">
              <img
                className="w-full h-full object-cover"
                alt="Moby Dick"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmboqOQukD3js43SbydQe9W2_uMltL7S1KOmVY0wD3WrhGUSuPlbPy04R9w5LMGAyjVUZeTJPnuMvPMwKZhBE1k6n_PFzFSv4ai7YLXGWI8XGj3ZbFqYhsNJrNtPQ-TkGNTJ9sM01NwapsMtYKBlBM3M9_ZD6KzHO6CzH24SXxz9y0PSoZTMQigbforH4Ut7cDU5gcFfwmttSfaNUaG30I1Ssv46ouE97y9xUkoSEQ0z_oWas_s26vFHRYjqNItJBIFOUA_khE0EKT"
              />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest"></div>
            </div>
            <h4 class="font-body-md font-semibold mt-space-sm leading-tight">Moby Dick</h4>
            <p className="font-label-mono text-label-mono text-on-surface-variant">Herman Melville</p>
          </div>
          {/* Library Item 5 */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-border-subtle bg-surface-container-low transition-all group-hover:shadow-lg">
              <img
                className="w-full h-full object-cover"
                alt="Pride and Prejudice"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwMITy8BmQFy19o7F5_HXSo5CSj0bGpq1XS0GrTpHd1Qlj57O_FK2FIG2p8iTblDDz7MHt8Kyt1OGoPgnyop6cJXmVMjBRtV6YfrRUcJeNwmdC9Kp08uybqylW0mgD1JiQSC6iRtQ1lx7yaA3oiAz39cWp_lmOiniG_j4_HdsqjfccAYTucCBqNK6HDUyxLLNQDzc4wevEjOYFHpAg40EeJXXHboCjAlw3zsjf02u-sPYhNJxlP2tzMKoSgrdb4OWSFkzYFzU4-b_U"
              />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-highest"></div>
            </div>
            <h4 class="font-body-md font-semibold mt-space-sm leading-tight">Pride and Prejudice</h4>
            <p className="font-label-mono text-label-mono text-on-surface-variant">Jane Austen</p>
          </div>
        </div>
        <div className="mt-space-xl flex justify-center">
          <button className="bg-surface-container-high text-on-surface font-semibold px-space-xl h-12 rounded-lg border border-border-subtle active:scale-95 transition-all">
            Load More
          </button>
        </div>
      </section>
    </main>
  );
}
