import ChallengePage from "@/components/GenerateChallenge";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function Home() {
  return (
    <DefaultLayout>
      <div className="flex min-h-screen flex-col  bg-gray-100 p-6 dark:bg-boxdark">
        <ChallengePage />
      </div>
    </DefaultLayout>
  );
}
