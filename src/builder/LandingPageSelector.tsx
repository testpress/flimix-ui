export default function LandingPageSelector({ landingPages, selectedLandingPage, setSelectedLandingPage }: any) {
  return (
    <select
      value={selectedLandingPage?.id || ''}
      onChange={e => {
        const page = landingPages.find((p: any) => p.id === parseInt(e.target.value));
        setSelectedLandingPage(page);
      }}
      className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-900"
    >
      <option value="">Select a landing page</option>
      {landingPages.map((page: any) => (
        <option key={page.id} value={page.id}>
          {page.name} {page.is_active && '(Active)'}
        </option>
      ))}
    </select>
  );
} 