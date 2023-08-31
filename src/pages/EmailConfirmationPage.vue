<template>
  <q-page class="q-pa-md">
    <div class="text-center q-py-lg">
      <img alt="Wallet logo" src="/icons/payment.png" style="width: 150px; height: 150px">
    </div>
    <p class="text-body1">
      Thanks for registering !
    </p>
    <p class="text-body1">
      Please confirm your email to finishing registering: <strong>{{ $route.query.email }}</strong>
    </p>
    <div class="row justify-center">
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-btn
          label="Back to Login"
          color="dark"
          class="full-width"
          rounded
          :to="{ name: 'login' }"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>

</script>
