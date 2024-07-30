import { useEffect, useState } from "react";

export function useStoicQuote() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<{ text: string, author: string } | null>(null);

    useEffect(() => {
        const fetchStoicQuote = async () => {
            try {
                setLoading(true);
                const response = await fetch("https://stoic-quotes.com/api/quote");
                const data = await response.json();
                console.log(data);
                setData(data);
            } catch (error: unknown) {
                setError("Error fetching Stoic quote");
            } finally {
                setLoading(false);
            }
        };

        fetchStoicQuote();
    }, []);

    return { data, error, loading };
}