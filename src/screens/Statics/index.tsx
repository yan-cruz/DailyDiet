import { useState, useEffect } from 'react'

import { snacksGetAll } from '@storage/snacks/snacksGetAll'

import { useNavigation, useRoute } from '@react-navigation/native'

import { CalculateIsInsideDietSequence } from '@utils/CalculateIsInsideDietSequence'

import { Container, Content, ContentTitle, SnackStaticsContainer } from './styles'

import { GeneralStatics } from '@components/GeneralStatics'
import { Percent } from '@components/Percent'
import { SnackStatics } from '@components/SnackStatics'

type RouteParam = {
  percent: number
}


export function Statics(){
  const [percent, setPercent] = useState(0)
  const [totalSnacks, setTotalSnacks] = useState(0)
  const [isInsideDietSnacks, setIsInsideDietSnacks] = useState(0)
  const [isOutsideDietSnacks, setIsOutsideDietSnacks] = useState(0)
  const [isInsideDietSnacksSequence, setIsInsideDietSnacksSequence] = useState(0)


  const navigation = useNavigation<NavigationProp<AppRoutes>>();
  const route = useRoute<RouteProp<AppRoutes, 'statics'>>();

  async function fetchDatas(){
    const { percent } = route.params as RouteParam

    const snacks = await snacksGetAll()

    const isInsideDietSnacks = snacks.filter(snack => snack.isInsideDiet === true)

    const isOutsideDietSnacks = snacks.filter(snack => snack.isInsideDiet === false)

    const sequence = await CalculateIsInsideDietSequence({snacks})


    setPercent(percent)
    setTotalSnacks(snacks.length)
    setIsInsideDietSnacks(isInsideDietSnacks.length)
    setIsOutsideDietSnacks(isOutsideDietSnacks.length)
    setIsInsideDietSnacksSequence(sequence)
  }

  useEffect(() => {
    fetchDatas()
  }, [])

  return (
    <Container
      DietUpToDate={percent > 50}
    >

      <Percent 
        DietUpToDate={percent > 50}
        onPressArrow={() => navigation.navigate('home')}
        percent={percent}
        ArrowPosition='LEFT'
      />

      <Content>
        <ContentTitle>
          Estatísticas gerais
        </ContentTitle>

        <GeneralStatics 
          number={isInsideDietSnacksSequence}
          description="melhor sequência de pratos dentro da dieta"
        />

        <GeneralStatics 
          number={totalSnacks}
          description="refeições registradas"
        />

        <SnackStaticsContainer>
          <SnackStatics 
            number={isInsideDietSnacks}
            description="refeições dentro da dieta"
            DietStatus='INSIDE'
            
          />

          <SnackStatics 
            number={isOutsideDietSnacks}
            description="refeições fora da dieta"
            DietStatus='OUT'
          />
        </SnackStaticsContainer>
      </Content>
      
    </Container>
  )
}
