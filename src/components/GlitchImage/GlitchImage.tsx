import React, { useEffect, useRef } from "react"
import { 
    GlitchImageStyled,
    DivGlitchSection, 
    ImgGlitch,
    ImgGlitchBase
} from "./GlitchImage.styled"


type GlitchImageInput = {
    image: string
    width?: number
    splitSize?: number
    animationInterval?: number
    animationDuration?: number
    variations?: Array<number>
    inside?: boolean
    opacity?: number
    brightness?: number,
    filter?: boolean,
    customFilter?: string,
    activeFxOnInterval?: boolean,
    activeFxOnHover?: boolean
    onActiveFx?: (time: number) => void
}
const GlitchImage = ({
    image,
    width = 20,
    splitSize = 8,
    animationInterval = 4000,
    animationDuration = 500,
    variations = [1.8, 3],
    inside = false,
    opacity = 0.3,
    brightness = 2,
    filter = true,
    customFilter,
    activeFxOnInterval = true,
    activeFxOnHover = true,
    onActiveFx
}: GlitchImageInput) => {

    const prom = 100 / splitSize;
    const ref = useRef<HTMLDivElement>(null)


    const getFilter = () => {
        if (filter && !customFilter) 
            return `hue-rotate(${Math.floor(Math.random() * 250)}deg) brightness(${brightness})`
        
        if (customFilter) {
            const regex = /\$([0-9]*)/gm;
            let m;
            const dataToReplace: Record<string,string> = {}
            while ((m = regex.exec(customFilter)) !== null) {
                m.index === regex.lastIndex && (regex.lastIndex++)
                dataToReplace[m[0]] = m[1]
            }
            return Object.keys(dataToReplace).reduce((acum, key) => {
                acum = acum.replace(key, String(Math.floor(Math.random() * Number(dataToReplace[key]) || 100 )))
                return acum
            }, customFilter)
        }

        return ""
    }

    useEffect(() => {
        if (activeFxOnInterval) {
            const intervalTime = setInterval(() => {
                setTimeout(() => {
                    ref.current?.classList.remove("GlitchImageActive")
                }, animationDuration)

                const imgs = ref.current?.querySelectorAll(".GlitchImageBaseFilter")
                imgs?.length && imgs.forEach((x) => (x as HTMLImageElement).style.filter =  getFilter())

                onActiveFx && onActiveFx(animationDuration)
                ref.current?.classList.add("GlitchImageActive")
            }, animationInterval)
            return () => clearInterval(intervalTime)
        }
    }, [activeFxOnInterval])


    useEffect(() => {
        const imgs = ref.current?.querySelectorAll(".GlitchImageBaseFilter")
        imgs?.length && imgs.forEach((x) => (x as HTMLImageElement).style.filter =  getFilter())
    }, [image])

    
    return (<GlitchImageStyled className="GlitchImage" width={width}>
        <img src={image} loading="lazy" />
        <DivGlitchSection ref={ref} inside={inside} variations={variations} activeFxOnHover={activeFxOnHover}>
            {Array(splitSize).fill(0).map((x, index) => (
                <ImgGlitchBase key={index} prom={prom} index={index} opacity={1}>
                    <img src={image} loading="lazy" />
                </ImgGlitchBase>
            ))}
            {Array(splitSize).fill(0).map((x, index) => (
                <ImgGlitch key={index} prom={prom} index={index} opacity={opacity}>
                    <img className="GlitchImageBaseFilter" src={image} loading="lazy" />
                </ImgGlitch>
            ))}
        </DivGlitchSection>
    </GlitchImageStyled>)
}

export { GlitchImage }