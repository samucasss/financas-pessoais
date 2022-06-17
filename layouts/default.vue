<template>
  <div>
    <MenuBar
      app-name="Finanças pessoais"
      user-name="SAMUEL"
      :menu-list="[
        { nome: 'Eventos', link: '/eventos/EventoList' },
        { nome: 'Acompanhamento', link: '/acompanhamento/AcompanhamentoList' }
      ]"
    />

    <div class="container" style="margin-top: 10px">
      <Nuxt />
    </div>
  </div>
</template>
