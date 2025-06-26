import { auth } from "@/lib/auth";
import {
  UpgradeView,
  UpgradeViewError,
  UpgradeViewLoading,
} from "@/module/premium/ui/views/upgrade-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }

  const queyClient = getQueryClient();
  void queyClient.prefetchQuery(
    trpc.premium.getCurrentSubscription.queryOptions()
  );
  void queyClient.prefetchQuery(trpc.premium.getProducts.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queyClient)}>
      <Suspense fallback={<UpgradeViewLoading />}>
        <ErrorBoundary fallback={<UpgradeViewError />}>
          <UpgradeView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
