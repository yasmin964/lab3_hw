

export function setupComicFetcher() {
    const getComicBtn: HTMLButtonElement = document.getElementById('get-comic-btn') as HTMLButtonElement;
    const emailForm: HTMLFormElement = document.getElementById('email-form') as HTMLFormElement;

    const comicContainer: HTMLDivElement = document.getElementById('comic-container') as HTMLDivElement;
    const comicTitle: HTMLHeadingElement = document.getElementById('safe_title') as HTMLHeadingElement;
    const comicImg: HTMLImageElement = document.getElementById('comic-img') as HTMLImageElement;
    const comicDate: HTMLParagraphElement = document.getElementById('comic-date') as HTMLParagraphElement;

    async function fetchComicID(email: string): Promise<number> {
        const params: URLSearchParams = new URLSearchParams({ email });
        const response: Response = await fetch(`https://fwd.innopolis.university/api/hw2?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Failed to fetch comic ID');
        }
        const data: {id: number} = await response.json();
        return data.id;
        
    }


    async function fetchComic(comicID: number): Promise<{ safe_title: string, img: string, alt: string, year: string, month: string, day: string }> {
        const response: Response = await fetch(`https://fwd.innopolis.university/api/comic?id=${comicID}`);
        if (!response.ok) {
            throw new Error('Failed to fetch comic');
        }
        return response.json();
    }
    
    getComicBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        
        const email: string = (emailForm.elements.namedItem('email')as HTMLInputElement).value;

        try {
            
            const idData: number = await fetchComicID(email);
            const comicId = idData; // Assuming `idData` directly gives the ID
            const comicData: { safe_title: string, img: string, alt: string, year: string, month: string, day: string } = await fetchComic(comicId);

            // Display the comic data securely
            comicTitle.textContent = comicData.safe_title; // Use textContent for security
            comicImg.src = comicData.img;
            comicImg.alt = comicData.alt ;

            const dateString: string = comicData.year + '-' + comicData.month + '-' + comicData.day;
            const date: Date = new Date(dateString);
            comicDate.textContent = date.toLocaleDateString();

            comicContainer.style.display = 'block';

        } catch (error) {
            console.error('Failed to fetch comic:', error);
            comicTitle.textContent = 'Error loading comic';
            comicImg.src = '';
            comicImg.alt = '';
            comicDate.textContent = '';
        }
    });
}
