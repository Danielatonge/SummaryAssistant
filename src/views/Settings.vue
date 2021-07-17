<template>
  <div>
    <v-container class="pb-10 text-color">
      <v-row>
        <v-col cols="12">
          <p class="text-h3 font-weight-bold text-center">
            Настройка горячих клавиш
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="6">
          <div class="text-h5 setting-column">
            <p class="text-center text-h4 mb-10">Горячие клавиши плеера</p>
            <v-row>
              <v-col cols="6" class="my-auto">
                <div>Плей/Пауза</div>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="ALT + G"
                  disabled
                  outlined
                  background-color="grey lighten-2"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="my-auto">
                <div>Предыдуший период</div>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="P"
                  disabled
                  outlined
                  background-color="grey lighten-2"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="my-auto">
                <div>Следующий период</div>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="ALT + M"
                  disabled
                  outlined
                  background-color="grey lighten-2"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="my-auto">
                <div>Снизить скорость</div>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="G"
                  disabled
                  outlined
                  background-color="grey lighten-2"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="my-auto">
                <div>Увеличить скорость</div>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="SHIFT + G"
                  disabled
                  outlined
                  background-color="grey lighten-2"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="my-auto">
                <div>Начать сначала</div>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="F12"
                  disabled
                  outlined
                  background-color="grey lighten-2"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col cols="12" lg="6">
          <div class="text-h5 setting-column">
            <p class="text-center text-h4 mb-10">Горячие клавиши текстового редактора</p>
            <v-row>
              <v-col cols="6" class="my-auto">
                <div>Добавить метку</div>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="A"
                  disabled
                  outlined
                  background-color="grey lighten-2"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="my-auto">
                <div>Скопировать</div>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="H"
                  disabled
                  outlined
                  background-color="grey lighten-2"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Settings",
};
</script>

<style>
.setting-column {
    border: 1px solid grey;
    padding: 30px;
    border-radius: 15px;
}
</style>