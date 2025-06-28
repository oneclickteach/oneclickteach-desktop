import { DOMAIN_PROVIDERS } from '@/app/constants/domainProviders';

export default function StepDomain() {
    return (
        <div className="space-y-4 h-full">
            <h2 className="text-xl font-semibold">Buy a Domain</h2>
            <p className="text-sm text-muted-foreground">
                Choose a domain name for your site and buy it from your preferred provider.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {DOMAIN_PROVIDERS.map((provider) => (
                    <div 
                        key={provider.tag} 
                        className="border rounded-lg p-4 bg-card cursor-pointer hover:bg-primary/5 transition-colors"
                        onClick={(e) => {
                            e.preventDefault();
                            window.open(provider.domainUrl, '_blank');
                        }}
                    >
                        <h3 className="text-lg font-semibold mb-2">
                            <span className="text-primary hover:text-primary/80 transition-colors">
                                {provider.nameEn} <span className="text-muted-foreground">({provider.nameFa})</span>
                            </span>
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">{provider.descriptionEn}</p>
                        <p className="text-sm text-muted-foreground">{provider.descriptionFa}</p>
                    </div>
                ))}
            </div>
            <p className="text-sm mt-4">
                After buying your domain, you’ll configure its DNS in the next step.
            </p>
        </div>
    )
}
