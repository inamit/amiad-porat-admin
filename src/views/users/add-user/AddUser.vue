<template>
  <v-row justify="center">
    <v-col> </v-col>
    <v-col
      cols="7"
      :style="`background-color: ${
        $vuetify.theme.dark ? '#3b355a' : 'white'
      }; border-radius: 2vh; padding: 2vw`"
    >
      <h1>יצירת משתמש חדש</h1>
      <br />
      <v-form v-model="valid" ref="form">
        <v-text-field
          v-model="firstname"
          :prepend-inner-icon="icons.mdiAccountOutline"
          label="שם פרטי"
          outlined
          placeholder="שם פרטי"
          :rules="rules.nameRules"
          required
        />
        <v-text-field
          v-model="lastName"
          :prepend-inner-icon="icons.mdiAccountOutline"
          label="שם משפחה"
          outlined
          placeholder="שם משפחה"
          :rules="rules.nameRules"
        />

        <v-text-field
          v-model="email"
          :prepend-inner-icon="icons.mdiEmailOutline"
          label="מייל"
          type="email"
          outlined
          placeholder="מייל"
          :rules="rules.emailRules"
          required
        />

        <v-text-field
          v-model="phoneNo"
          :prepend-inner-icon="icons.mdiCellphone"
          label="מספר טלפון"
          outlined
          type="tel"
          placeholder="מספר טלפון"
          required
          gleap-ignore="value"
          :rules="rules.phoneRules"
        />

        <v-menu
          ref="menu"
          v-model="birthDateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
          absolute
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              label="תאריך לידה"
              outlined
              :prepend-inner-icon="icons.mdiCalendarRange"
              v-model="formattedBirthDate"
              readonly
              v-on="on"
              v-bind="attrs"
              required
            ></v-text-field>
          </template>
          <v-date-picker
            locale="he-iw"
            v-model="birthDate"
            :active-picker.sync="activePicker"
            :max="
              new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .substr(0, 10)
            "
            @change="birthDateMenu = false"
            :rules="rules.dateRules"
          ></v-date-picker>
        </v-menu>

        <v-text-field
          v-model="password"
          :prepend-inner-icon="icons.mdiLockOutline"
          label="סיסמה"
          outlined
          type="password"
          placeholder="סיסמה"
          :rules="rules.passwordRules"
        />

        <v-select
          :items="roles"
          v-model="role"
          required
          label="סוג המשתמש"
          outlined
          :prepend-inner-icon="icons.mdiAccountCogOutline"
          :rules="rules.roleRules"
        ></v-select>
        <v-select
          v-if="role === 'student'"
          :items="grades"
          v-model="grade"
          required
          label="כיתה"
          outlined
          :prepend-inner-icon="icons.mdiGoogleClassroom"
        ></v-select>

        <v-select
          v-if="role === 'student'"
          :items="groups"
          item-value="id"
          v-model="group"
          required
          label="שיעור"
          outlined
          :prepend-inner-icon="icons.mdiGoogleClassroom"
          :rules="rules.groupRules"
        >
          <template v-slot:item="data">
            {{ data.item.name }} | {{ data.item.teacher.firstName }}
            {{ data.item.teacher.lastName }}
          </template>
          <template v-slot:selection="data">
            {{ data.item.name }} | {{ data.item.teacher.firstName }}
            {{ data.item.teacher.lastName }}
          </template>
        </v-select>

        <v-btn color="primary" @click="addUser"> צור משתמש </v-btn>
        <v-btn type="reset" outlined class="mx-2"> אפס </v-btn>
      </v-form>
    </v-col>
    <v-col> </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  mdiAccountOutline,
  mdiEmailOutline,
  mdiCellphone,
  mdiLockOutline,
  mdiAccountCogOutline,
  mdiCalendarRange,
  mdiGoogleClassroom,
} from "@mdi/js";
import { getFunctions, httpsCallable } from "firebase/functions";
import { Watch } from "vue-property-decorator";
import Swal from "sweetalert2";
import Joi from "joi";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore";
import UserRole from "@/models/userRoles";

@Component({ name: "AddUser" })
export default class AddUser extends Vue {
  valid = true;
  firstname = "";
  lastName = "";
  email = "";
  phoneNo = "";
  password = "";
  role = "";
  birthDate = "";
  grade = "";
  group = "";

  get formattedBirthDate() {
    if (!this.birthDate) return null;

    const [year, month, day] = this.birthDate.split("-");
    return `${day}/${month}/${year}`;
  }

  rules = {
    nameRules: [(value: string) => Boolean(value) || "יש להכניס שם"],
    emailRules: [
      (value: string) =>
        Joi.string()
          .required()
          .email({ tlds: { allow: false } })
          .messages({
            "string.empty": "יש להכניס אימייל",
            "string.email": "כתובת מייל אינה תקינה",
          })
          .validate(value, {
            abortEarly: true,
          }).error?.message,
    ],
    phoneRules: [
      (value: string) =>
        Joi.string()
          .required()
          .length(10)
          .pattern(/^05\d{8}$/)
          .validate(value).error?.message
          ? "מספר הטלפון אינו תקין"
          : null,
    ],
    dateRules: [
      (value: string) =>
        Joi.string()
          .required()
          .messages({ "string.empty": "יש לבחור תאריך לידה" })
          .validate(value).error?.message,
    ],
    passwordRules: [
      (value: string) =>
        Joi.string()
          .required()
          .min(6)
          .messages({
            "string.empty": "יש להכניס סיסמה",
            "string.min": "סיסמה צריכה להיות לפחות 6 תווים",
          })
          .validate(value).error?.message,
    ],
    roleRules: [
      (value: string) =>
        Joi.string()
          .required()
          .messages({ "string.empty": "יש לבחור את סוג המשתמש" })
          .validate(value).error?.message,
    ],
    gradeRules: [
      (value: string) =>
        Joi.string()
          .required()
          .messages({ "string.empty": "יש לבחור כיתה" })
          .validate(value).error?.message,
    ],
    groupRules: [
      (value: string) =>
        Joi.string()
          .required()
          .messages({ "string.empty": "יש לבחור שיעור" })
          .validate(value).error?.message,
    ],
  };

  private roles = [
    { text: "תלמיד", value: UserRole.STUDENT },
    { text: "מתרגל", value: UserRole.TUTOR },
    { text: "מורה", value: UserRole.TEACHER },
    { text: "מנהל", value: UserRole.ADMIN },
  ];
  private grades = [
    { text: "ז", value: 7 },
    { text: "ח", value: 8 },
    { text: "ט", value: 9 },
    { text: "י", value: 10 },
    { text: "יא", value: 11 },
    { text: "יב", value: 12 },
  ];

  private groups: Record<string, unknown>[] = [];

  async getGroups() {
    this.groups = [];
    const groups = await getDocs(query(collection(getFirestore(), "groups")));

    groups.forEach(async (group) => {
      const teacher = await getDoc(
        doc(getFirestore(), "users", group.get("teacher"))
      );

      this.groups.push({
        id: group.id,
        name: group.get("name"),
        teacher: teacher.data(),
      });
    });
  }

  created() {
    this.getGroups();
  }

  private birthDateMenu = false;
  private activePicker = "";

  icons = {
    mdiAccountOutline,
    mdiEmailOutline,
    mdiCellphone,
    mdiLockOutline,
    mdiAccountCogOutline,
    mdiCalendarRange,
    mdiGoogleClassroom,
  };

  async addUser() {
    if (!(this.$refs.form as Vue & { validate: () => boolean }).validate())
      return false;

    const createUser = httpsCallable(getFunctions(), "createUser");

    try {
      Swal.showLoading();
      const response = await createUser({
        email: this.email,
        password: this.password,
        firstName: this.firstname,
        lastName: this.lastName,
        phoneNo: this.phoneNo,
        role: this.role,
        birthDate: this.birthDate,
        grade: this.grade,
        group: this.group,
      });
      Swal.hideLoading();
      Swal.fire({ icon: "success", title: "המשתמש נוסף בהצלחה!" });
    } catch (error: any) {
      console.log(error);
      Swal.hideLoading();
      Swal.fire({
        icon: "error",
        title: "לא הצלחנו להוסיף את המשתמש",
        text: error.message,
      });
    }
  }

  @Watch("birthDateMenu")
  onPropertyChanged(value: boolean, oldValue: boolean) {
    value && setTimeout(() => (this.activePicker = "YEAR"));
  }
}
</script>
