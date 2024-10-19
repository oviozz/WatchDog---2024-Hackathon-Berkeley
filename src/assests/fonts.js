
import {Bricolage_Grotesque, Gabarito, Inter, Poppins} from 'next/font/google';

export const inter = Inter({subsets: ['latin']});

export const bricolage = Bricolage_Grotesque({
    weight: ['200','300','400','500','700','800'],
    subsets: ['latin'],
});

export const gabarito = Gabarito({
    weight: ['400','500','700','800','900'],
    subsets: ['latin'],
})


export const poppins = Poppins({
    weight: ['300', '500','400','500'],
    subsets: ['latin'],

})
