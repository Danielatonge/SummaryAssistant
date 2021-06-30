<template>
  <div>
    <v-container class="text-center mt-10">
      <v-row class="d-flex justify-center">
        <v-col cols="8">
          <v-sheet
            class="rounded-lg mx-auto d-flex flex-wrap justify-center"
            color="transparent"
            height="400"
          >
            <div class="my-auto">
              <div class="mb-6">
                <v-btn class="px-6" outlined rounded>
                  Создать конференцию
                </v-btn>
              </div>
              <div class="mb-6">
                <v-btn class="px-6" outlined rounded>
                  Подключиться к конференции
                </v-btn>
              </div>
              <div>
                <v-btn class="px-6" outlined rounded>
                  Получить расшифровку
                </v-btn>
              </div>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>